import React, { memo } from 'react';

const ImageContainer = ({ imgElement, children }) => {
    return (
        <div style={styles.imgContainerStyle} ref={ref => { imgElement.current.push(ref) }}>
            {children}
        </div>
    )
}

const styles = {
    imgContainerStyle: {
        width: '100%',
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
}

export default memo(ImageContainer)