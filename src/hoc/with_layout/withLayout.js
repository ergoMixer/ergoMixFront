import React from 'react';


const withLayout = (Layout, layoutProps = null) => {
    return (Component, componentProps = null) => {
        return (props) => (
            <Layout {...layoutProps} {...props}>
                <Component {...componentProps} {...props}/>
            </Layout>
        )
    }
};

export default withLayout;
