import PointsOfInterestList from '../components/poi/PointsOfInterestList';
import SEO from '../components/SEO';


export default function PointsOfInterestPage() {
    return (
        <>
            <SEO
                title="Points of Interest"
                description="Discover the best surfing spots, hiking trails, and stargazing locations in the Canary Islands."
            />
            <PointsOfInterestList />
        </>
    );
}
