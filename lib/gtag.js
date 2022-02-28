export const pageview = (url) => {
    window.gtag("config", 'G-X29MNPW1TZ', {page_path: url});
};

export const event = ({action, category, label, value}) => {
    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value
    });
};
