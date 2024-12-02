export async function fetchWithoutBody(url: string, method: any, signal : any = null) {

    const promise = $fetch<any>("http://127.0.0.1:3001/api/" + url, {
            method: method,  // Méthode HTTP à utiliser pour la requête

            credentials: 'include',
            // On passe le cookie pour vérifier si l'utilisateur est connecté coté middleware laravel
            headers: {
                'cookie': useCookie('laravel_session').value ? 'laravel_session=' + useCookie('laravel_session').value : ''
            },
            signal: signal ? signal : undefined,
        }
    );
    return await promise;
}

export async function fetchWithBody(url: string, method: any, body : any = null, signal : any = null) {

    const { data, error, refresh } = await useAsyncData ('',
        () => $fetch("http://127.0.0.1:3001/api/" + url, {
            method: method,
            credentials: 'include',
            // On passe le cookie pour vérifier si l'utilisateur est connecté coté middleware laravel
            headers: {
                'cookie': useCookie('laravel_session').value ? 'laravel_session=' + useCookie('laravel_session').value : '',
            },
            body: body,
            signal: signal ? signal : undefined

        })
    );

    return data;
}

