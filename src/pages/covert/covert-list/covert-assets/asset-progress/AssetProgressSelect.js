import React from 'react';
import AssetProgress from "./AssetProgress";
import PendingAsset from './PendingAsset';

const AssetProgressSelect = props => {
    if(props.ring === 0){
        return <PendingAsset {...props}/>
    }
    return <AssetProgress {...props}/>
};

export default AssetProgressSelect;