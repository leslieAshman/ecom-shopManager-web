/* eslint-disable no-restricted-globals */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from '../../assets/icons';
import { Button, Dropdown } from '../../components';
import Carousel, { CarouselEvent, CarouselState } from '../../components/Carousel';
import CheckBox from '../../components/CheckBox';
import { DropdownItem } from '../../components/Dropdown';
import { DDConfig, DDFilterItem, FilterDDType, onCheckItemChange } from '../../components/Filters/Filters';
import Loading from '../../components/Loading/loading';

import SlideOutPanel from '../../components/SlideOutPanel';
import { NavigationPath } from '../../types/DomainTypes';
import { buildDisplayText, toInternalId, uniqueItems } from '../../utils';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import SharedLayout from '../shared/SharedLayout';
import EventAndExperience from './components/EventAndExperience';
import EventSlideout from './components/EventSlideout';
import LearningHubCard from './components/LearningHubCard';
import LearningHubSlideout from './components/LearningHubSlideout';

import { GET_EVENTS_AND_EXPERIENCES } from './graphql/getEventsAndExperiences';
import { GET_LEARNING_HUB } from './graphql/getLearningHub';
import { useGetDocuments } from './hooks/useGetDocuments';
import { EventAndExperienceType, LearningHubType } from './type';

const allItems = 'All Items';

enum DisplayTextKeys {
  TITLE = 'discover:title',
  VIEW_ALL_TEXT = 'discover:texts.view-all',
  EVENTS_AND_EXPERIENCES = 'discover:texts.events-and-experiences',
  LEARNING_HUB = 'discover:texts.learning-hub',
  SLIDE_OUT_EVENT_TITLE = 'discover:slideout.event-details-title',
  SLIDE_OUT_LEARNING_HUB_TITLE = 'discover:slideout.learning-hub-title',
  BACK = 'discover:back',
  APPLY_BUTTON_TEXT = 'portfolio:filters.applyButtonText',
  CLEAR_FILTERS = 'portfolio:filters.clearFilters',
}

enum SlideOutPanelViews {
  LEARNING_HUB = 'learning_hub',
  EVENTS = 'events',
  VIEW_ALL = 'viewAll',
}

interface ViewAllContextType {
  open: boolean;
  type: Omit<SlideOutPanelViews, 'viewAll'>;
  source: (EventAndExperienceType | LearningHubType)[];
  title: string;
}

const Discovery = () => {
  const { t } = useTranslation();
  const viewAllDivRef = useRef<HTMLDivElement | null>(null);
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'discover:', t), [t]);
  const [filteredEvents, setFilteredEvents] = useState<EventAndExperienceType[]>([]);

  const { results: eventAndExperiences, loading: loadingEvents } = useGetDocuments({
    gqlQueryNode: GET_EVENTS_AND_EXPERIENCES,
    documentProp: 'eventInput',
    docType: 'cwi_portal_event',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { results: learningHub, loading: loadingLearingHub } = useGetDocuments({
    gqlQueryNode: GET_LEARNING_HUB,
    documentProp: 'learningInput',
    docType: 'cwi_portal_learning_hub',
  });

  const [viewAllContext, setViewAllContext] = useState<ViewAllContextType>({
    open: false,
    type: SlideOutPanelViews.LEARNING_HUB,
    source: [] as ViewAllContextType['source'],
    title: '',
  });
  const [carouselState, setCarouselState] = useState<{
    [key: string]: CarouselState;
  }>({
    [SlideOutPanelViews.LEARNING_HUB]: {
      isNextDisabled: false,
      isPrevDisabled: false,
    } as CarouselState,
    [SlideOutPanelViews.EVENTS]: { isNextDisabled: false, isPrevDisabled: false } as CarouselState,
  });

  const [dropdownConfig, setDropDownConfig] = useState<DDConfig>({
    open: false,
    control: '',
    locations: {
      selectedText: 'Select location',
      selectedIds: [],
      allIds: [],
    },
  });
  const eventCarouselRef = useRef();
  const learningHubCarouselRef = useRef();

  const [slideOutPanelConfig, setSlideOutPanelConfig] = useState({
    open: false,
    view: SlideOutPanelViews.EVENTS,
    item: {} as EventAndExperienceType | LearningHubType,
    title: '',
    timestamp: Date.now(),
  });
  const { isLoading, results: datasource, lastItemRef } = useInfiniteScroll(viewAllContext.source);

  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading });

  const onItemSelect = (selected: unknown, view: SlideOutPanelViews) => {
    const slideoutTitle =
      view === SlideOutPanelViews.EVENTS
        ? displayText[DisplayTextKeys.SLIDE_OUT_EVENT_TITLE]
        : displayText[DisplayTextKeys.SLIDE_OUT_LEARNING_HUB_TITLE];
    setSlideOutPanelConfig({
      open: true,
      title: slideoutTitle,
      item: selected as EventAndExperienceType | LearningHubType,
      view,
      timestamp: Date.now(),
    });
  };

  const onCarouselStateUpdate = (args: CarouselState) => {
    setCarouselState({ ...carouselState, [args.id]: args });
  };

  const defaultDropdownConfig = useMemo(() => {
    const availableCountries = uniqueItems(
      (eventAndExperiences as EventAndExperienceType[]).map((x) => x.country || ''),
    ).filter((x) => x !== '');

    availableCountries.sort();
    const defaultConfig = {
      open: false,
      control: '',
      locations: {
        selectedText: 'Select location',
        selectedIds: [],
        allIds: availableCountries.map((x) => toInternalId(x)),
      },
    };
    setDropDownConfig({ ...defaultConfig });
    return defaultConfig;
  }, [eventAndExperiences]);

  const onClearLocationFilter = () => {
    const source = [...(eventAndExperiences as EventAndExperienceType[])];
    setDropDownConfig({
      ...dropdownConfig,
      locations: {
        ...(defaultDropdownConfig.locations as Record<string, unknown>),
      },
    });
    setFilteredEvents([...source]);
    setViewAllContext({ ...viewAllContext, source });
  };

  const filterEventsByLocation = (selectedLocations: string[]) => {
    let source = [...(eventAndExperiences as EventAndExperienceType[])];
    if (selectedLocations.length > 0)
      source = source.filter((x) => selectedLocations.includes(toInternalId(x.country || '-1')));
    return source;
  };
  const onLocationFilterItemSelect = (key: string, item: DropdownItem) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const results = onCheckItemChange(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      [locationFilter] as DDFilterItem[],
      dropdownConfig,
      key,
      item.id,
      toInternalId(allItems),
    );
    setFilteredEvents(filterEventsByLocation(results?.selectedIds || []));
    setDropDownConfig({
      ...dropdownConfig,
      locations: {
        ...(dropdownConfig.locations as Record<string, unknown>),
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ...results,
        selectedText:
          results?.selectedText || (defaultDropdownConfig.locations as Record<string, unknown>).selectedText,
      },
    });
  };

  const onApplyLocationFilter = () => {
    setDropDownConfig({
      ...dropdownConfig,
      open: false,
    });
    setViewAllContext({
      ...viewAllContext,
      source: filterEventsByLocation((dropdownConfig.locations as Record<string, unknown>).selectedIds as string[]),
    });
  };

  const renderEvent = (item: unknown) => {
    const itemToRender = item as EventAndExperienceType;
    return (
      <EventAndExperience
        item={itemToRender}
        id={itemToRender.id as string}
        onItemSelect={() => onItemSelect(itemToRender, SlideOutPanelViews.EVENTS)}
      />
    );
  };
  const renderLearningHub = (item: unknown) => {
    const itemToRender = item as LearningHubType;
    return (
      <LearningHubCard
        item={itemToRender}
        id={itemToRender.id as string}
        onItemSelect={() => onItemSelect(itemToRender, SlideOutPanelViews.LEARNING_HUB)}
      />
    );
  };

  const renderViewAllItems = (type: ViewAllContextType['type'], dataItem: EventAndExperienceType | LearningHubType) => {
    return type === SlideOutPanelViews.EVENTS ? renderEvent(dataItem) : renderLearningHub(dataItem);
  };

  const viewAll = (type: ViewAllContextType['type']) => {
    if (type === SlideOutPanelViews.EVENTS) setFilteredEvents(eventAndExperiences as EventAndExperienceType[]);
    setViewAllContext({
      title:
        displayText[
          type === SlideOutPanelViews.LEARNING_HUB
            ? DisplayTextKeys.LEARNING_HUB
            : DisplayTextKeys.EVENTS_AND_EXPERIENCES
        ],
      open: true,
      type,
      source:
        type === SlideOutPanelViews.LEARNING_HUB
          ? (learningHub as LearningHubType[])
          : (eventAndExperiences as EventAndExperienceType[]),
    });
  };

  const locationFilter = useMemo(() => {
    const filterType = 'locations';
    const availableCountries = uniqueItems(
      (eventAndExperiences as EventAndExperienceType[]).map((x) => x.country || ''),
    ).filter((x) => x !== '');
    availableCountries.sort();

    const filterOptions = [allItems, ...availableCountries].map((x) => {
      const id = `${toInternalId(x)}`;
      const text = x;
      return {
        id: id,
        value: id,
        text,
        content: (
          <CheckBox
            isChecked={((dropdownConfig.locations as FilterDDType).selectedIds as string[]).includes(id)}
            id={id}
            className=" flex-1 sm:w-[300px]"
          >
            <span className="ml-3 text-black text-14">{text}</span>
          </CheckBox>
        ),
      };
    });

    return {
      type: filterType,
      items: filterOptions,
      defaulText: displayText.SELECT_REGIONS_TEXT,
      dataRef: filterType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(dropdownConfig.locations as FilterDDType).selectedIds, eventAndExperiences]);

  useEffect(() => {
    if (viewAllContext.open) {
      viewAllDivRef.current?.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewAllContext.open]);

  const disableControlClassName = 'opacity-30 pointer-events-none';
  const enableClassName = 'cursor-pointer pointer-events-auto';
  return (
    <SharedLayout
      view={NavigationPath.DISCOVER}
      title={displayText[DisplayTextKeys.TITLE]}
      onBack={() => null}
      showBackButton={false}
    >
      <>
        {!viewAllContext.open && (
          <>
            <div className="divide-y divide-y-gray-100 gap-5">
              <div className="flex w-full flex-col pb-10">
                <div className="text-20 p-5 pb-2 flex items-center">
                  <div className="flex-1">{displayText[DisplayTextKeys.EVENTS_AND_EXPERIENCES]}</div>
                  {eventAndExperiences && eventAndExperiences.length > 1 && (
                    <div className="flex  gap-5 items-center">
                      <Button isLink={true} className="text-14" onClick={() => viewAll(SlideOutPanelViews.EVENTS)}>
                        {displayText[DisplayTextKeys.VIEW_ALL_TEXT]}
                      </Button>

                      <ChevronLeft
                        className={`${
                          carouselState[SlideOutPanelViews.EVENTS].isPrevDisabled
                            ? disableControlClassName
                            : enableClassName
                        }  `}
                        onClick={() =>
                          eventCarouselRef.current && (eventCarouselRef.current as CarouselEvent).prevClick()
                        }
                      />
                      <ChevronRight
                        className={`${
                          carouselState[SlideOutPanelViews.EVENTS].isNextDisabled
                            ? disableControlClassName
                            : enableClassName
                        }  `}
                        onClick={() =>
                          eventCarouselRef.current && (eventCarouselRef.current as CarouselEvent).nextClick()
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="h-[400px] flex flex-col">
                  {loadingEvents && <Loading />}
                  {!loadingEvents && (
                    <Carousel
                      id={SlideOutPanelViews.EVENTS as string}
                      showRightButton={false}
                      showLeftButton={false}
                      onCarouselStateUpdate={onCarouselStateUpdate}
                      ref={eventCarouselRef}
                      renderItem={({ translatedItem }) => renderEvent(translatedItem.item)}
                      slideItems={eventAndExperiences as unknown as Record<string, unknown>[]}
                    />
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col py-3 pb-10">
                <div className="text-20 p-5 pb-2 flex items-center">
                  <div className="flex-1">{displayText[DisplayTextKeys.LEARNING_HUB]}</div>
                  {learningHub && learningHub.length > 1 && (
                    <div className="flex  gap-5 items-center">
                      <Button
                        isLink={true}
                        className="text-14"
                        onClick={() => viewAll(SlideOutPanelViews.LEARNING_HUB)}
                      >
                        {displayText[DisplayTextKeys.VIEW_ALL_TEXT]}
                      </Button>

                      <ChevronLeft
                        className={`${
                          carouselState[SlideOutPanelViews.LEARNING_HUB].isPrevDisabled
                            ? disableControlClassName
                            : enableClassName
                        }  `}
                        onClick={() =>
                          learningHubCarouselRef.current &&
                          (learningHubCarouselRef.current as CarouselEvent).prevClick()
                        }
                      />
                      <ChevronRight
                        className={`${
                          carouselState[SlideOutPanelViews.LEARNING_HUB].isNextDisabled
                            ? disableControlClassName
                            : enableClassName
                        }  `}
                        onClick={() =>
                          learningHubCarouselRef.current &&
                          (learningHubCarouselRef.current as CarouselEvent).nextClick()
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="h-[400px] flex flex-col">
                  {loadingLearingHub && <Loading />}
                  {!loadingLearingHub && (
                    <Carousel
                      id={SlideOutPanelViews.LEARNING_HUB as string}
                      showRightButton={false}
                      showLeftButton={false}
                      onCarouselStateUpdate={onCarouselStateUpdate}
                      ref={learningHubCarouselRef}
                      renderItem={({ translatedItem }) => renderLearningHub(translatedItem.item)}
                      slideItems={learningHub as unknown as Record<string, unknown>[]}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {viewAllContext.open && (
          <div className="flex flex-col flex-1 h-full w-full" ref={(e) => (viewAllDivRef.current = e)}>
            <div className="text-20 p-5 pb-2 flex items-center">
              <div className="flex-1">{viewAllContext.title}</div>
              <div className="flex  gap-5 items-center">
                <Button
                  isLink={true}
                  className="text-14"
                  onClick={() => setViewAllContext({ ...viewAllContext, source: [], open: false })}
                >
                  {displayText[DisplayTextKeys.BACK]}
                </Button>
              </div>
            </div>
            {eventAndExperiences &&
              eventAndExperiences.length > 1 &&
              viewAllContext.type === SlideOutPanelViews.EVENTS && (
                <div className="flex  p-5">
                  <Dropdown
                    autoClose={false}
                    open={dropdownConfig.open}
                    onOpen={() =>
                      setDropDownConfig({
                        ...dropdownConfig,
                        open: !dropdownConfig.open,
                      })
                    }
                    valueTemplate={
                      <div className="flex w-[95%]">
                        <span className="truncate block">
                          {(dropdownConfig.locations as FilterDDType).selectedText}
                        </span>
                      </div>
                    }
                    placeholder="Select location"
                    onItemSelect={(item) => onLocationFilterItemSelect(locationFilter.type, item)}
                    items={locationFilter.items}
                    itemsWrapperClassName="w-full"
                    itemsContainerClassName="h-[300px] overflow-y-auto"
                    itemClassName="py-5 text-base flex"
                    className="flex-1 text-sm w-[360px] sm:text-14 text-black whitespace-nowrap p-0 justify-start border-b border-b-gray-400"
                    header={
                      <div className="p-5 pt-5 flex justify-end ">
                        <span className="flex-1 text-gray-700 text-sm">{'Available Countries'}</span>
                      </div>
                    }
                    footer={
                      <div className="p-5  border-t border-t-100 flex justify-between w-full bg-white rounded-b-md">
                        <Button
                          isLink={true}
                          className={`text-14 text-gray-500`}
                          onClick={() => onClearLocationFilter()}
                          props={{
                            name: 'clearFilter',
                          }}
                        >
                          {displayText[DisplayTextKeys.CLEAR_FILTERS]}
                        </Button>
                        <Button
                          className={`btn text-14 w-fit font-normal bg-orange rounded-full  `}
                          onClick={() => onApplyLocationFilter()}
                          props={{
                            name: 'applyLocationFilters',
                          }}
                        >
                          {displayText[DisplayTextKeys.APPLY_BUTTON_TEXT].replace(
                            /\{\{.*\}\}/g,
                            `${filteredEvents.length}`,
                          )}
                        </Button>
                      </div>
                    }
                  />
                </div>
              )}
            <div className="flex flex-wrap gap-3 flex-1 h-full w-full px-5  justify-center overflow-hidden overflow-y-auto">
              {datasource.map((x, index) => {
                let lastElemRefOption = { ref: isItemVisible };
                if (datasource.length === index + 1) {
                  lastElemRefOption = { ref: lastItemRef };
                }
                return (
                  <div
                    {...{ ...lastElemRefOption }}
                    className={`w-full sm:w-[300px] ${fadeOnScrollClassName}`}
                    key={`render-item-${index}`}
                  >
                    {renderViewAllItems(viewAllContext.type, x)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <SlideOutPanel
          headClassName="bg-gray-100 text-black"
          title={slideOutPanelConfig.title}
          isOpen={slideOutPanelConfig.open}
          onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
        >
          {slideOutPanelConfig.open && slideOutPanelConfig.view === SlideOutPanelViews.EVENTS && (
            <EventSlideout
              event={slideOutPanelConfig.item as EventAndExperienceType}
              timestamp={slideOutPanelConfig.timestamp}
              onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
            />
          )}
          {slideOutPanelConfig.open && slideOutPanelConfig.view === SlideOutPanelViews.LEARNING_HUB && (
            <LearningHubSlideout
              product={slideOutPanelConfig.item as LearningHubType}
              timestamp={slideOutPanelConfig.timestamp}
              onClose={() => setSlideOutPanelConfig({ ...slideOutPanelConfig, open: false })}
            />
          )}
        </SlideOutPanel>
      </>
    </SharedLayout>
  );
};

export default Discovery;
