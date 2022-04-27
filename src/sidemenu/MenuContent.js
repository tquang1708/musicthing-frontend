import React from 'react';

function MenuContent(props) {
    const {
        showSidebar,
    } = props;

    return (
        <div className={`flex flex-row grow transition ease-in-out duration-500 ${showSidebar ? "translate-y-0" : "-translate-y-full"}`}>
            <MenuTabItems 
                showSidebar={showSidebar}
            />
            <MenuTabContent 
                showSidebar={showSidebar}
            />
        </div>
    );
}

function MenuTabItems(props) {
    return (
        <div className={`bg-purple-500 grow z-30 w-14 2xl:w-20`}>
            TAB ITEMS
        </div>
    )
}

function MenuTabContent(props) {
    return (
        <div className={`bg-pink-500 grow z-30 w-42 2xl:w-60`}>
            MENU CONTENT
        </div>
    )
}

export default MenuContent;