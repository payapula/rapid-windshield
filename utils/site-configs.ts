// Inspired by Chakra - https://github.com/chakra-ui/chakra-ui/blob/main/website/configs/site-config.ts
import { NextSeoProps } from 'next-seo';

interface SiteConfig {
    general: {
        siteUrl: string;
        authorEmail: string;
    };
    seo: NextSeoProps;
}

const HOSTED_URL = 'YTD';

export const APP_NAME = 'Bakers Hunt';

const siteConfig: SiteConfig = {
    general: {
        siteUrl: HOSTED_URL,
        authorEmail: 'bharathikannanv05@gmail.com'
    },
    seo: {
        title: APP_NAME,
        defaultTitle: APP_NAME,
        titleTemplate: `%s | ${APP_NAME}`,
        description: `${APP_NAME}, Where you search for all the good homebakers and cake makers in Coimbatore.`,
        openGraph: {
            type: 'website',
            title: `${APP_NAME} website`,
            description: `${APP_NAME}, Where you search for all the good homebakers and cake makers in Coimbatore.`,
            site_name: APP_NAME,
            url: HOSTED_URL
            // images: [
            //     {
            //         url: getBasePath('/assets/resume/bharathikannanavatar.jpg'),
            //         alt: 'Bakers Hunt Logo'
            //     }
            // ]
        }
    }
};

export default siteConfig;
