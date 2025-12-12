import PointsOfInterestList from '../components/poi/PointsOfInterestList';

/**
 * PointsOfInterest Page Component.
 *
 * This page serves as the main view for browsing and managing Points of Interest (POIs).
 * It wraps the `PointsOfInterestList` component, which handles the core logic and display.
 *
 * @component
 * @returns {JSX.Element} The rendered PointsOfInterest page.
 */
export default function PointsOfInterestPage() {
    return <PointsOfInterestList />;
}
