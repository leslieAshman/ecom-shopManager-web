/* eslint-disable @typescript-eslint/naming-convention */
// import React, { useState, useCallback, useContext, useEffect } from 'react';
// import _ from 'lodash';
// import { useHistory } from 'react-router-dom';
// import ShopDetailsView from '../components/shopDetails';
// import Icon, { iconEnum } from '../../components/cInput/reactjs/controls/icons';
// import { AppStateContext, ActionContext } from '../../context';
// import TradingInfo from '../components/tradingInfo';
// import Agreement from '../Legal/agreement';
// import SetUpComplete from '../components/setupComplete';
// import { diff, QShopModel } from '../../Utilities/util';
// import AwaitResponse from '../components/awaitResponse';
// import { InfoAlert } from '../../components/cInput/reactjs/controls/confirmBox';
// import moment from 'moment';
// import { cLog } from '../../Utilities/commonFunctions';

import ShopDetailsView from '../ShopDetailView';

import { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'context/ContextProvider';
import { getBlankPortfolioModel } from 'helpers';
import { MiscellaneousEventTypes } from 'types/AppType';
import { ObjectType } from 'types/commonTypes';
import TradingInfo from '../TradingInfo';
import Agreement from '../Agreement';
import SetUpComplete from '../SetUpComplete';
import Stepper, { StepperEventType } from 'components/Stepper';
import { mockCreateShopRequest } from 'mocks';
import { useExecuteMutation } from 'views/hooks/useExecuteMutation';
import { CREATE_PORTFOLIO_MUTATION } from 'views/Accounts/graphql/Mutation/createPortfolio';
import { BasePortfolioType, PortfolioEventTypes } from 'views/Portfolio/types';

//const preProcessUpdate = (updatedModel) => {
//   const preProcessor = [
//     {
//       id: 'logo',
//       fn: (model) => {
//         Object.assign(model, {
//           logo: {
//             createdDate: model.logo.createdDate,
//             pic: JSON.stringify({
//               image: model.logo.image,
//               name: model.logo.name,
//               type: model.logo.type,
//             }),
//           },
//         });
//       },
//     },
//     {
//       id: 'country',
//       fn: (model) => {
//         Object.assign(model, {
//           country: model.country.name,
//           countryObj: JSON.stringify(model.country),
//         });
//       },
//     },

//     {
//       id: 'city',
//       fn: (model) => {
//         Object.assign(model, {
//           city: !!model.city.isNew && model.city.isNew ? model.city : model.city.name,
//         });
//       },
//     },
//     {
//       id: 'area',
//       fn: (model) => {
//         Object.assign(model, {
//           area: !!model.area.isNew && model.area.isNew ? model.area : model.area.value,
//         });
//       },
//     },

//     {
//       id: 'currency',
//       fn: (model) => {
//         Object.assign(model, {
//           currency: JSON.stringify({
//             long: model.currency.text || model.currency.long,
//             short: model.currency.name || model.currency.short,
//             symbol: model.currency.symbol,
//           }),
//         });
//       },
//     },
//   ];

//   const processor = preProcessor.filter((x) => _.keys(updatedModel).includes(x.id));
//   if (processor && processor.length > 0) {
//     processor.forEach((p) => {
//       p.fn(updatedModel);
//     });
//   }
// };
function isObject(obj: ObjectType | string | number) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

enum AddEntityEventType {
  ON_REMOVE_TAG = 'ON_REMOVE_TAG',
  UPDATE_MODEL = 'UPDATE_MODEL',
  QUIT = 'QUIT',
  DONE = 'DONE',
}

interface ProgressStatus {
  isDetailsComplete: boolean;
  isTradingInfo: boolean;
  isAddListingComplete?: boolean;
  isAgreementSigned: boolean;
  isDone: boolean;
}

interface AddShopProps {
  entityModel?: BasePortfolioType;
  onComplete?: () => void;
  isUpdate?: boolean;
  onUploadLogo?: () => void;
}

const AddShop: FC<AddShopProps> = ({
  entityModel = getBlankPortfolioModel(),
  onComplete,
  isUpdate = false,
  onUploadLogo,
}) => {
  const navigate = useNavigate();
  const {
    state: { user, portfolio, miscellaneous: misc },
    dispatch,
  } = useContext(AppContext);

  console.log('Portfolio', portfolio);
  const [infoAlertConfig, setInfoAlertConfig] = useState({
    isModalOpen: false,
  });
  const { executor, error, loading, data } = useExecuteMutation(CREATE_PORTFOLIO_MUTATION);

  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [setupStatus, updateSetupStatus] = useState<ProgressStatus>({
    isDetailsComplete: false,
    isTradingInfo: false,
    isAddListingComplete: false,
    isAgreementSigned: false,
    isDone: false,
  });
  // const actionContext = useContext(ActionContext);
  // const { onUpdateUtil, onUpdateShop, onCreateShop, onPartialUpdateShop, updateAlert } = actionContext;
  const getEntity = useMemo(() => {
    return {
      ...entityModel,
      _id: entityModel?._id || -((user.portfolios?.length || 0) + 1),
    };
  }, [entityModel, user.portfolios?.length]);

  const [model, setModel] = useState<BasePortfolioType>({ ...getEntity });
  const [originalModel] = useState({ ...model });
  const { owner, ownerPic, website, hashTags, email, phoneNo, currency } = entityModel;
  const ownerShopModel = {
    ...{ owner, ownerPic, website, hashTags, email, phoneNo, currency },
  };

  useEffect(() => {
    setModel({ ...getEntity });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityModel.name]);

  // if (appState.shop.logo !== model.logo) {
  //   console.log("MOdel", model);
  //   setModel({
  //     ...appState.shop,
  //   });
  // }

  // const onShowInfoAlertBox = (item, i = 0) => {
  //   setInfoAlertConfig({
  //     isModalOpen: true,
  //     isDelete: true,
  //     item: { ...{ title: '', body: '', footer: '' }, ...item },
  //     index: i,
  //     cancelText: '',
  //     okText: 'Ok',
  //     isHideCancelBtn: true,
  //     title: '',
  //     isHideHeader: true,
  //     isCenterDialogue: true,
  //   });
  // };

  const onBack = useCallback((_: unknown, viewIndex: number) => {
    setCurrentViewIndex(viewIndex - 1);
  }, []);

  const onUpdateShop = (updatedModel: BasePortfolioType) => {
    dispatch({
      type: PortfolioEventTypes.UPDATE_SHOP,
      payload: {
        ...updatedModel,
      },
    });
  };

  const createNewShop = () => {
    const newShop = { ...mockCreateShopRequest }; /// { ...mockCreateShopRequest, ...model };
    executor({
      createShopInput: newShop,
    });
  };

  const onCTA = async (eventType: AddEntityEventType, dataIn: any) => {
    switch (eventType) {
      case AddEntityEventType.ON_REMOVE_TAG:
        const _hashTags = [...(model.hashTags ?? [])];
        _hashTags.splice(dataIn, 1);
        setModel({
          ...model,
          hashTags,
        });
        break;
      case AddEntityEventType.UPDATE_MODEL:
        setModel({
          ...model,
          ...dataIn,
        });
        break;
      case AddEntityEventType.QUIT:
        onUpdateShop({ ...getBlankPortfolioModel() });
        //  if (onComplete && history) onComplete(history);
        break;
      case AddEntityEventType.DONE:
        break;
      // case 'DONE':
      //   if (!data) {
      //     onShowInfoAlertBox({ title: 'Oops', body: 'Nothing to update' });
      //     return;
      //   }
      //   let shopUpdate = { ...data };
      //   if (isUpdate) {
      //     const updateModel = {
      //       ...originalModel,
      //       ...refreshModel(originalModel),
      //     };
      //     const area = updateModel.area;
      //     if (typeof updateModel.area === 'string') {
      //       const xArea = appState.util.areas.find((x) => x.value === updateModel.area);
      //       updateModel.area = xArea || updateModel.area;
      //     }
      //     shopUpdate = diff(updateModel, data);
      //     delete shopUpdate.timeStamp;
      //     console.log('SHOP DIFF', shopUpdate);
      //     if (_.isEmpty(shopUpdate)) {
      //       onShowInfoAlertBox({ body: 'Nothing to update' });
      //       return;
      //     }
      //     preProcessUpdate(shopUpdate);
      //     console.log('PRE PROCESSED UPDATE', shopUpdate);
      //   }
      //   if (_.keys(shopUpdate).length === 1 && _.keys(shopUpdate)[0] === 'logo') {
      //     if (onUploadLogo) onUploadLogo(shopUpdate.logo, originalModel._id);
      //     return;
      //   }
      //   const { logo, ...xUpdate } = shopUpdate;
      //   updateSetupStatus({
      //     ...setupStatus,
      //     isDone: true,
      //   });
      //   AwaitResponse(
      //     actionContext,
      //     () => {
      //       if (isUpdate) return onPartialUpdateShop(appState.selectedShopId, xUpdate);
      //       return onCreateShop(
      //         {
      //           ...appState.shops.find((x) => x._id === appState.selectedShopId),
      //           ...xUpdate,
      //           createdBy: appState.user._id,
      //         },
      //         !isUpdate,
      //       );
      //     },
      //     () => {
      //       if (logo && onUploadLogo) {
      //         onUploadLogo(logo);
      //         return;
      //       }
      //       if (onComplete) onComplete(history);
      //     },
      //   );
      //   break;

      default:
        break;
    }
  };

  const onStepperChange = (eventType: StepperEventType) => {
    switch (eventType) {
      case StepperEventType.CANCEL:
        break;
      case StepperEventType.BACK:
        break;
      case StepperEventType.SAVE:
        createNewShop();
        break;
      default:
        break;
    }
  };

  const onNext = useCallback(
    (modelIn: BasePortfolioType, viewIndex: number) => {
      const updatedModel = {
        ...user?.portfolios?.find((x) => x._id === portfolio?._id),
        ...modelIn,
      } as BasePortfolioType;

      if (typeof updatedModel._id === 'string' && viewIndex === 1) {
        onCTA(AddEntityEventType.DONE, updatedModel);
        return;
      }

      dispatch({
        type: MiscellaneousEventTypes.UPDATE_UTIL,
        payload: {
          city: updatedModel.city,
          area: updatedModel.area,
        },
      });

      onUpdateShop(updatedModel);

      const isDone = viewIndex > 2;
      //const cview = views[viewIndex];
      updateSetupStatus({
        isDetailsComplete: viewIndex >= 0,
        isTradingInfo: viewIndex > 0,
        // isAddListingComplete: viewIndex > 1,
        isAgreementSigned: viewIndex > 1,
        isDone,
      });
      if (isDone) {
      } else {
        setCurrentViewIndex(viewIndex + 1);
        setModel(updatedModel);
      }
      // cview.isCompleted = true;
      // const updatedViews = [
      //   ...views.slice(0, viewIndex),
      //   cview,
      //   ...views.slice(viewIndex + 1, views.length),
      // ];
      // setViews(updatedViews);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.portfolios, portfolio?._id],
  );

  const countries = misc.countries as any;
  const cities = misc.cities as any;
  const boroughs = misc.londonBoroughs as any;
  const refreshModel = (modelIn: { city: BasePortfolioType['city']; country: BasePortfolioType['country'] }) => {
    return {
      ...modelIn,
      country: modelIn.country && isObject(modelIn.country) ? modelIn.country : countries[0],
      city:
        modelIn.city && modelIn.city.length > 0
          ? cities.find((x: any) => x.name === modelIn.city) || cities[0]
          : cities[0],
      //   area:
      //     !_.isNil(modelIn.area) && modelIn.area.length > 0
      //       ? boroughs.find((x) => x.value === modelIn.area) || boroughs[0]
      //       : boroughs[0],
    };
  };

  const enrolmentForm = [
    {
      id: 'shop',
      title: 'Shop Details',
      isDisabled: false,
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      html: (
        <ShopDetailsView
        // modelIn={{
        //   ...appState.shop,
        // }}
        //   onCTA={onCTA}
        //   onCancel={() => {
        //     history.push('/home');
        //     if (onComplete) onComplete();
        //   }}
        //   modelIn={{ ...model, timeStamp: moment().format('YYYYMMDDHHmmss') }}
        //   viewIndex={0}
        //   onNext={onNext}
        //   onBack={onBack}
        />
      ),
      isCompleted: setupStatus.isDetailsComplete,
    },
    {
      id: 'trading-details',
      title: 'Trading Details',
      isDisabled: false,
      icon: null,
      html: (
        <TradingInfo
        // onNext={onNext}
        // onCTA={(eventType, data) => onCTA(eventType, data)}
        // viewIndex={1}
        // modelIn={ownerShopModel}
        // onBack={onBack}
        />
      ),
      isCompleted: setupStatus.isTradingInfo,
    },
    {
      id: 'agreement',
      title: 'Agreement',
      isDisabled: false,
      icon: null,
      html: (
        <Agreement
        // onNext={onNext} viewIndex={2} onCTA={onCTA}
        />
      ),
      isCompleted: setupStatus.isAgreementSigned,
    },
    // {
    //   id: 2,
    //   title: "Products / Services",
    //   isDisabled: false,
    //   html: (
    //     <ServiceListing
    //       onNext={onNext}
    //       onCTA={(eventType, data) => onCTA(eventType, data)}
    //       viewIndex={2}
    //       onBack={onBack}
    //     />
    //   ),
    //   isCompleted: setupStatus.isAddListingComplete,
    // },
    {
      id: 'create-shop',
      title: 'Create Shop',
      isDisabled: false,
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
          <path d="M22 4L12 14.01l-3-3"></path>
        </svg>
      ),
      html: (
        <SetUpComplete
        //  onCTA={(eventType) => onCTA(eventType, model)} viewIndex={3}
        />
      ),
      isCompleted: setupStatus.isDone,
    },
  ];
  return (
    <Stepper steps={enrolmentForm} containerClassName="px-1 sm:px-5 " onCTA={onStepperChange} />

    //  <div className="container">
    //   {typeof model._id !== 'string' && (
    //     <div className="stepwizard pt-10 pb-2 px-2">
    //       <div className="flex flex-1 w-full">
    //         {views.map((view, x) => {
    //           view.isDisabled = x !== currentViewIndex;
    //           return (
    //             <div key={`step-${x}`} className="flex flex-col flex-1">
    //               <div className="flex flex-row align-items-center">
    //                 <button
    //                   onClick={(e) => e.preventDefault()}
    //                   type="button"
    //                   disabled={view.isDisabled}
    //                   className={`mx-3 p-0 flex align-items-center justify-center link-button btn btn-circle is-valid ${
    //                     view.isDisabled ? 'bg-blue-100 text-gray-500' : 'btn-grad1 text-white '
    //                   }`}
    //                 >
    //                   {view.isCompleted ? (
    //                     <span className="icon" style={{ fontSize: '30px' }}>
    //                       {/* <Icon config={{ type: iconEnum.ROUND_TICK }} /> */}
    //                     </span>
    //                   ) : (
    //                     <span>{x + 1}</span>
    //                   )}
    //                 </button>
    //                 {x < views.length - 1 && view.isCompleted && (
    //                   <div className="flex-1">
    //                     <div className="w-full bg-grad1" style={{ height: '1px' }} />
    //                   </div>
    //                 )}
    //               </div>
    //               <small
    //                 style={{ minWidth: '60px' }}
    //                 className={`text-center  w-50 text-wrap text-xs ${
    //                   view.isDisabled ? 'text-gray-600' : 'text-grad1'
    //                 }`}
    //               >
    //                 {view.title}
    //               </small>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //   )}
    //   <form role="form">
    //     {views.map((view, x) => {
    //       return (
    //         currentViewIndex === x && (
    //           <div key={`${x}`} className="row setup-content" id={`step-${x}`}>
    //             <div style={{ width: '100%' }}>{view.html}</div>
    //           </div>
    //         )
    //       );
    //     })}
    //   </form>
    //   {/* <InfoAlert {...{ infoAlertConfig, setInfoAlertConfig }} /> */}
    // </div>
  );
};

export default AddShop;
