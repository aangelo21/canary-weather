import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, name, type }) => {
    return (
        <Helmet>
            {}
            <title>{title} | Canary Weather</title>
            <meta name="description" content={description} />

            {}

            {}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {}

            {}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {}
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
};

SEO.defaultProps = {
    title: 'Canary Weather',
    description:
        'Accurate weather forecasts, tide charts, and activity guides for the Canary Islands.',
    name: 'Canary Weather',
    type: 'website',
};

export default SEO;
