import { Avatar } from "@/components/domains/users";

export type AuthDataType = {
    id: string,
    slug: string,
    email?: string,
    last_name?: string,
    first_name?: string,
    phone?: string,
    username?: string,
    fbm_token?: string,
    completed?: boolean,
    updated_at?: boolean
}

export type AuthContextType = {
    authData?: AuthDataType,
    loading: boolean,
    registering: boolean,
    updating?: boolean,
    logged: boolean,
    error: string,
    message: string,
    baseUrl?: string,
    setUrl(url: string): Promise<any>;
    signIn(email: string, password: string): Promise<any>;
    register(email: string, login: string, password: string, fbm_token?: string): Promise<any>;
    update(data : AuthDataType): Promise<any>;
    signOut(): void;
}

export type TitleType = {
    text: string;
    size?: number;
    color?: string;
    push?: number;
    align?: 'left' | 'center' | 'right';
    weight?: 'normal' | 'bold';
}

export type ButtonSimpleType = {
    color?: string; 
    width?: string | number; 
    text: string;
    onPress?: (data: any) => void
}

export type HowitWorkType = {
    textFooter: string;
    textBody: string;
    image: any,
    key: string;
}

export type SettingType = {
    title: string;
    key: string;
    description?: string;
    url?: string;
}

export type InputType = {
    value?: string | undefined;
    onChangeText: any; 
    label?: string; 
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
    error?: string | undefined;
    info?: string;
    required?: boolean;
    iconName?: any;
}

export type InvoiceItemType = {
    id: number;
    designation: string;
    quantity: number;
    price_ht: number;
    amount_ht: number;
    order?: number
}

export type InvoiceType = {
    id: number;
    slug: string;
    sale_conditions: string;
    amount_ht: number;
    amount_ttc: number;
    amount_rate: number;
    accepted_at?: string;
    accepted: boolean;
    refused_at?: string;
    refused: boolean;
    rate?: number;
    items: InvoiceItemType[]
}

export type AssistType = {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    vehicle_id?: number;
    link_send_by?: string;
    send_payment_link_by?: string;
    url?: string;
    latitude?: number,
    longitude?: number,
    start_date?: string,
    vehicle?: string,
    city?: string,
    status?: string,
    comment?: string,
    can_show_contract?: boolean,
    show_contract_action?: boolean,
    show_payment_link?: boolean,
    payment_link?: string,
    contract_link?: string,
    request_type?: string,
    invoice?: InvoiceType;
    onSelect?: (sinister: AssistType) => void,

}

export type GPSType = {
    latitude?: number
    longitude?: number
}

export type ExpoNotificationType = {
    token?: string,
    notification?: any,
    data?: any
}

export type AssistContextType = {

    create: (
        position: GPSType,
        onSuccess: (data: any) => void,
        onError: (error: string) => void
    ) => void

    update: (
        sinister: AssistType,
        onSuccess: (data: any) => void,
        onError: (error: string) => void
    ) => void

    destroy?: (id: number) => void,

    findUnclosed: () => Promise<any>,

    assist: AssistType,

    processing: boolean,

    controller: AbortController
};

export type VehicleType = {
    id: number;
    designation: string;
    number?: string;
    brand?: string;
    color?: string;
    updated?: (data:VehicleType) => void
}

export type BadgeIconType = {
    icon: any;
    title: string;
    subTitle?: string;
    onPress?: () => void
}

export type EventType = {
    id: number;
    slug: string;
    title: string;
    info?: string;
    color?: string;
    end_time: string;
    start_time: string;
}

export type SchoolLifeType = {
    id: number;
    title: string;
    info?: string;
    count: number;
    iconName: string;
    key: string;
}

export type SchoolLifeInfoType = {
    id: number;
    comment: string;
    date: string;
    motive?: string;
    created_by: string;
    subject: string;
    view_at?: string;
    view_by?: string;
    details?: string;
    late_in_minut?: number;
    important?: boolean;
    must_justify?: boolean;
    dead_line?: string;
    todo?: string;
}

export interface SchoolLifeSelected {
    onSelect: (item: SchoolLifeType) => void;
}

export type AgendaType = {
    today?: boolean
}

export type DropdownItemType = {
    key: string,
    value: string,
    disabled?: boolean
}

export type DropdownType = {
    data: DropdownItemType[],
    placeholder?: string
    onSelect: (item: any) => void
}

export type DateType = {
    date: Date,
    onSelect: (date: Date) => void
}

export type AvatarType = {
    uri?: string, 
    pickUpHandler: () => void,
    allowPickup: boolean
}

export type VideoType = {
    id: number,
    slug: string,
    designation: string,
    code: string,
    color?: string
    image?: string
    info?: string
}

export type VideoRawType = {
    id: number,
    slug: string,
    designation: string,
    description?: string,
    duration_in_text: string,
    coach_name: string,
    level_name: string,
    type_name: string,
    category_name: string,
    type_slug: string,
    cover: string,
    url: string,
    materiel_list?: string
}