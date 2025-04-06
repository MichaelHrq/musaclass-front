'use server'

import postagens from '@/db/postagens.json'

export default async function getPostagensAction () {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return postagens
}