import { useCallback, useEffect, useMemo, useState } from 'react';
import { bookingsService } from '@/src/features/services/services/bookingsService';
import { servicesService } from '@/src/features/services/services/servicesService';
import {
  Booking,
  BookingAvailabilityDay,
  BookingMode,
  BookingSlot,
  Professional,
  ServiceOffering,
} from '@/src/features/services/types';

export type BookingStep = 1 | 2 | 3 | 4 | 5;

const DEFAULT_STEP: BookingStep = 1;

export function useBookingFlow(professionalId: string, initialOfferingId?: string) {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | undefined>(initialOfferingId);
  const [selectedMode, setSelectedMode] = useState<BookingMode | undefined>(undefined);
  const [selectedDayId, setSelectedDayId] = useState<string | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);
  const [clientAddress, setClientAddress] = useState<string>('');
  const [step, setStep] = useState<BookingStep>(DEFAULT_STEP);
  const [availability, setAvailability] = useState<BookingAvailabilityDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let active = true;

    servicesService.getProfessionalById(professionalId)
      .then((result) => {
        if (!active) {
          return;
        }
        setProfessional(result);
        if (result && !initialOfferingId && result.offerings.length > 0) {
          setSelectedOfferingId(result.offerings[0].id);
        }
      })
      .catch(() => {
        if (active) {
          setError('Impossible de charger ce parcours de réservation.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [initialOfferingId, professionalId]);

  const selectedOffering = useMemo<ServiceOffering | undefined>(() => {
    return professional?.offerings.find((item) => item.id === selectedOfferingId);
  }, [professional, selectedOfferingId]);

  useEffect(() => {
    if (!selectedOffering) {
      setSelectedMode(undefined);
      return;
    }

    if (!selectedMode || !selectedOffering.modes.includes(selectedMode)) {
      setSelectedMode(selectedOffering.modes[0]);
    }
  }, [selectedMode, selectedOffering]);

  useEffect(() => {
    if (!professional || !selectedOffering || !selectedMode) {
      setAvailability([]);
      setSelectedDayId(undefined);
      setSelectedSlotId(undefined);
      return;
    }

    let active = true;
    setLoading(true);

    bookingsService.getAvailability(professional.id, selectedOffering.id, selectedMode)
      .then((days) => {
        if (!active) {
          return;
        }

        setAvailability(days);
        if (!days.some((day) => day.id === selectedDayId)) {
          const firstDay = days[0];
          setSelectedDayId(firstDay?.id);
          const firstAvailableSlot = firstDay?.slots.find((slot) => slot.available);
          setSelectedSlotId(firstAvailableSlot?.id);
        }
      })
      .catch(() => {
        if (active) {
          setError('Impossible de charger les créneaux disponibles.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [professional, selectedOffering, selectedMode]);

  const selectedDay = useMemo(() => availability.find((item) => item.id === selectedDayId), [availability, selectedDayId]);
  const selectedSlot = useMemo<BookingSlot | undefined>(() => selectedDay?.slots.find((slot) => slot.id === selectedSlotId), [selectedDay, selectedSlotId]);

  const canContinueFromStep1 = Boolean(selectedOffering);
  const canContinueFromStep2 = Boolean(selectedMode && (selectedMode !== 'domicile' || clientAddress.trim().length > 5));
  const canContinueFromStep3 = Boolean(selectedDay && selectedSlot);

  const goNext = useCallback(() => {
    setError('');

    if (step === 1 && !canContinueFromStep1) {
      setError('Sélectionnez une prestation pour continuer.');
      return;
    }

    if (step === 2 && !canContinueFromStep2) {
      setError(selectedMode === 'domicile' ? 'Renseignez une adresse pour une prestation à domicile.' : 'Choisissez un mode de rendez-vous.');
      return;
    }

    if (step === 3 && !canContinueFromStep3) {
      setError('Choisissez une date et un horaire disponibles.');
      return;
    }

    setStep((current) => Math.min(5, current + 1) as BookingStep);
  }, [canContinueFromStep1, canContinueFromStep2, canContinueFromStep3, selectedMode, step]);

  const goBack = useCallback(() => {
    if (step === 1) {
      return false;
    }

    setError('');
    setStep((current) => Math.max(1, current - 1) as BookingStep);
    return true;
  }, [step]);

  const confirmBooking = useCallback(async () => {
    if (!professional || !selectedOffering || !selectedMode || !selectedDay || !selectedSlot) {
      setError('Réservation incomplète.');
      return null;
    }

    setSaving(true);
    setError('');

    try {
      const booking = await bookingsService.createBooking({
        professionalId: professional.id,
        offeringId: selectedOffering.id,
        mode: selectedMode,
        slotId: selectedSlot.id,
        date: selectedDay.date,
        dateLabel: selectedDay.label,
        timeLabel: selectedSlot.label,
        startsAt: selectedSlot.startsAt,
        endsAt: selectedSlot.endsAt,
        clientAddress: selectedMode === 'domicile' ? clientAddress.trim() : undefined,
      });

      setCreatedBooking(booking);
      setStep(5);
      return booking;
    } catch {
      setError('Impossible de confirmer cette réservation pour le moment.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [clientAddress, professional, selectedDay, selectedMode, selectedOffering, selectedSlot]);

  return {
    professional,
    selectedOffering,
    selectedOfferingId,
    selectedMode,
    selectedDay,
    selectedSlot,
    selectedDayId,
    selectedSlotId,
    clientAddress,
    step,
    availability,
    loading,
    saving,
    error,
    createdBooking,
    setSelectedOfferingId,
    setSelectedMode,
    setSelectedDayId,
    setSelectedSlotId,
    setClientAddress,
    goNext,
    goBack,
    setStep,
    confirmBooking,
  };
}
