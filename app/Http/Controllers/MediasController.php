<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediasController
{
    /**
     * @param $mediaId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download($mediaId)
    {
        $media = Media::find($mediaId);

        return response()->download($media->getPath(), $media->file_name);
    }

    /**
     * @param $mediaId
     * @return string
     */
    public function show($mediaId)
    {
        try {
            $media = Media::find($mediaId);
            $disk = Storage::disk($media->disk);

            return Response::make($disk->get("{$media->getKey()}/{$media->file_name}"), 200, [
                'Content-Type' => $media->mime_type
            ]);

        } catch (\Throwable $exception) {
            return asset('img/app-logo.png');
        }
    }

    /**
     * @param $mediaId
     * @return string
     */
    public function delete($mediaId)
    {
        try {
            $media = Media::find($mediaId);
            $media->delete();
        } catch (\Throwable $exception) {
        }

        return back()->with('success', trans('media.deleted'));
    }

    public function deleteAjax($mediaId)
    {
        try {
            $media = Media::find($mediaId);
            $media->delete();
        } catch (\Throwable $exception) {
            return response(['success' => false]);
        }

        return response(['success' => true]);
    }

    /**
     * @param $mediaId
     * @return string
     */
    public function viewer($mediaId)
    {
        $media = Media::query()->find($mediaId);

        $url = route('medias.show', ['mediaId' => $mediaId]);

        return response(view('medias.viewer', compact('media', 'url')))
            ->header('Content-Type', $media->mime_type);
    }
}
