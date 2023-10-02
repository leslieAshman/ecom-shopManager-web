import React, { useContext, useState } from 'react';
import AddShop from './components/AddShop';
import { AppContext } from 'context/ContextProvider';

const OnboardShop = () => {
  const appState = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [currenView, setCurrentView] = useState(-1);
  //   const renderCurrentView = () => {
  //     if (currenView > -1) return views[currenView].html;
  //     return null;
  //   };

  const onModalClose = () => {
    setShowModal(false);
  };
  const onNewShop = () => {
    setCurrentView(0);
    setShowModal(true);
  };

  const views = [
    {
      id: 'newShop',
      html: <AddShop />,
    },
  ];
  return (
    <div className="no-padding container w-screen border-red border  mb-3 col-lg-8">
      <div className="flex w-full h-[40px] items-center">
        <h1 className="display-6" style={{ width: '100%', flex: 1, margin: 0 }}>
          Shops
        </h1>

        <button
          className="btn btn-link"
          style={{ width: '150px' }}
          onClick={(e) => {
            e.preventDefault();
            onNewShop();
          }}
        >
          {'Create new shop'}
        </button>
      </div>

      <div style={{ padding: 20, display: 'flex' }}>
        <div
          style={{
            flex: 1,
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridGap: '20px',
              gridTemplateColumns: ' repeat(auto-fill, minmax(200px, 1fr))',
              // gridTemplateRows: "120px",
            }}
          >
            {/* {appState.user.shops.map((shop, i) => (
              <div key={i} className="card mb-3">
                <img
                  style={{ height: '200px', width: '100%', display: 'block' }}
                  //  / src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_158bd1d28ef%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_158bd1d28ef%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22129.359375%22%20y%3D%2297.35%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                  src={shop.logo.image}
                  alt="Card image"
                />
                <div className="card-body">
                  <h5 className="card-title">{shop.name}dsds</h5>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* <ModalComponent
        config={{
          container: {
            content: {
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              marginRight: '0',
              transform: 'none',
            },
          },
        }}
        className="animated fadeIn"
        isOpen={showModal}
        onCloseModal={onModalClose}
      >
        {renderCurrentView()}
      </ModalComponent> */}
    </div>
  );
};

export default OnboardShop;
