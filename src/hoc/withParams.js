import { useParams } from "react-router-dom";

export const withParams = (Component) => {
    return props => {
        const params = useParams();
        return (<Component {...props} match={{ params }}/>)
    };
}