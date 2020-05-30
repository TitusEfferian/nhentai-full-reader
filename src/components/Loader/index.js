import React, { memo } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <ClipLoader />
        </div>
    )
}

export default memo(Loader);
