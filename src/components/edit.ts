import {User} from "../../utils";

export const defaultUser: User = {
    translations: ["enqarai"],
    tafseers: [],
    audio: "murparhizgar",
    wbwtranslation: "english",
    rasm: "uthmani",
    autoplay: false,
    surahAudio: "Amer Al Kadhimi"
};


const returnUser = (cookies : any) => {
    const userCookie = ( cookies !== undefined ? JSON.parse(cookies) : undefined);
    let user = userCookie !== undefined ? userCookie : defaultUser;
    user.translations = [...new Set(user.translations)as any] as string[]
    user.tafseers = [...new Set(user.tafseers)as any] as string[]
    return user
}

const edit = (query : any, clientUser : any) => {
    let user = returnUser(clientUser);
    Object.keys(query).filter((e) => e !== "s" && e !== "v").forEach((e) => {
        switch (e) {
            case "t":
                if (! user.translations.includes(query[e])) 
                    user.translations.unshift(query[e]);
                
                break;
            case "c":
                if (! user.tafseers.includes(query[e])) 
                    user.tafseers.unshift(query[e]);
                
                break;
            case "w": user.wbwtranslation = query[e];
                break;
            case "a": user.audio = query[e];
                break;
            case "r": user.rasm = query[e];
                break;
        }
    });
    return user;
}

const returnUser2 = (req : any) => {
    const userCookie = (typeof req.cookies ?. user !== "undefined" ? JSON.parse(req.cookies ?. user) : undefined);
    let user = userCookie !== undefined ? userCookie : defaultUser;
    user.translations = [...new Set(user.translations)as any] as string[]
    user.tafseers = [...new Set(user.tafseers)as any] as string[]
    return user
};

export const edit2 = (query : any, req : any) => {
    let user = returnUser2(req);
    Object.keys(query).filter((e) => e !== "s" && e !== "v").forEach((e) => {
        switch (e) {
            case "t":
                if (! user.translations.includes(query[e])) 
                    user.translations.unshift(query[e]);

                break;
            case "c":
                if (! user.tafseers.includes(query[e])) 
                    user.tafseers.unshift(query[e]);

                break;
            case "w": user.wbwtranslation = query[e];
                break;
            case "a": user.audio = query[e];
                break;
            case "r": user.rasm = query[e];
                break;
        }
    });
    return user;
}

export default edit
