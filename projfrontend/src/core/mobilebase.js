import React from 'react';
import MobileMenu from './mobilemenu';

const MobileBase = ({className="container-fluid bg-dark" ,children}) =>{
    return(
        <div>
            <MobileMenu />
            <br/><br />
            <div className={className}>{children}</div>
        </div>
    )
}

export default MobileBase;