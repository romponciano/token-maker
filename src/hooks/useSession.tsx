import { sha256 } from "js-sha256"
import { useState } from "react"
import USER_API from "../api/users"

export default function useSession() {
    const USER_KEY = 'user'
    
    const getSession = (): ISession => {
        const user = sessionStorage.getItem(USER_KEY)
        if(user) return { username: user, password: undefined }
        saveSession(undefined)
        return undefined
    }

    const saveSession = async (session: ISession | undefined): Promise<void> => {
        var token

        if(!session || !session.username || !session.password) 
            token = undefined
        else {
            session.password = sha256(session.password)
            token = await USER_API.login(session)
        }

        if(typeof token == 'string' || typeof token == 'number') {
            sessionStorage.setItem(USER_KEY, session.username)
            setSession(session)
        } else {
            sessionStorage.removeItem(USER_KEY)
            throw 'Bad request'
        }
    }

    const [session, setSession] = useState<ISession | undefined>(undefined)

    return {
        setSession: saveSession,
        session: getSession()
    }
}
