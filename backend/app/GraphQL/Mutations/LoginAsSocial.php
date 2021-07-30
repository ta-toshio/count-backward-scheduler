<?php

namespace App\GraphQL\Mutations;

use App\Exceptions\SystemErrorException;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\JWT\Error\IdTokenVerificationFailed;
use Kreait\Firebase\JWT\IdTokenVerifier;

class LoginAsSocial
{

    /**
     * @var UserRepository
     */
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     * @throws SystemErrorException
     */
    public function __invoke($_, array $args)
    {
        $input = collect($args['input']);

        $verifier = IdTokenVerifier::createWithProjectId('my-scheduler-local');

        $token = $verifier->verifyIdToken($input->get('id_token'));

        $user = $this->userRepository->findByEmail($input->get('email'));
        if (!$user) {
            $user = $this->userRepository->createUserOfThirdParty(
                $input->get('email'),
                $input->get('name')
            );
            if (!$user) {
                throw new SystemErrorException();
            }
        }

        Auth::login($user);

        return $user;
    }

}
