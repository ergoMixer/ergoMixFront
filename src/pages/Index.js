import React from 'react';
import MultiStep from "../components/multistep/MultiStep";
import withLayout from "../hoc/with_layout/withLayout";
import MainLayout from '../layout/main-layout/MainLayout';

const index = (props) => {
    const steps = [
        {title: "how many Erg do you want to mix", component: "salam"},
        {title: "generate boxes and fees", component: "khubi"},
        {title: "withdraw addresses", component: "mamnun"},
    ];
    return (
        <div className="row">
            <div className="col-6 offset-3">
                <MultiStep steps={steps}/>
            </div>
        </div>
    );
};

export default withLayout(MainLayout)(index);
