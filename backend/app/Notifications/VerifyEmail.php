<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as IlluminateVerifyEmail;

class VerifyEmail extends IlluminateVerifyEmail
{
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return parent::toMail($notifiable)
            ->view(
                'emails.verify-email',
                [
                    'url' => $this->verificationUrl($notifiable),
                    'user' => $notifiable
                ]
            );
    }

    protected function verificationUrl($notifiable): string
    {
        $url = parent::verificationUrl($notifiable);
        $slug = substr($url, strpos($url, '/email'));
        return 'https://'.explode(',',env('SANCTUM_STATEFUL_DOMAINS'))[0].'/users/'.$slug;
    }

}
