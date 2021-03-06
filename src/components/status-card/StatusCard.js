import React from 'react';
import PendingDepositCard from "./PendingDepositCard";
import PreMixCard from "./PreMixCard";
import MixingCard from "./MixingCard";


class StatusCard extends React.Component {

    render = () => {
        if (this.props.status === 'queued') {
            return <PendingDepositCard {...this.props}/>
        } else if (this.props.status === 'starting') {
            return <PreMixCard {...this.props}/>
        }
        return <MixingCard {...this.props}/>
    }
}

export default StatusCard;

