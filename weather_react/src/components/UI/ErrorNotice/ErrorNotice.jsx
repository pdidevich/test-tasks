import React from 'react';
import cl from './ErrorNotice.module.css'

const ErrorNotice = ({children}) => {
    return (
        <div className={cl.notice}>
            {children}
        </div>
    );
};

export default ErrorNotice;
