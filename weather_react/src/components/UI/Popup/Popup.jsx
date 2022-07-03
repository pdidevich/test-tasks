import React from 'react';
import cl from './Popup.module.css'

const Popup = ({ children, hide }) => {
    return (
        <div className={cl.back} onClick={hide}>
            <div className={cl.content} onClick={evt => evt.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Popup;
