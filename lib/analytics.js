export const pageview = (url) => {
    if (window && window.gtag) {
        window.gtag('config', 'G-X29MNPW1TZ', {
            page_path: url,
        })
    }
}

export const event = ({ action, params }) => {
    window.gtag('event', action, params)
}