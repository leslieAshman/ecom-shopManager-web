import angular from "angular";
import lposts from "./containers/lposts/lposts";

angular.module("app", ["lposts"]).controller("appCtrl", [
  "$scope",
  "$timeout",
  "$window",
  function ($scope, $timeout, $window, $interval) {
    const port =
      $window.location.port.length > 0 ? `:${$window.location.port}` : "";
    //const domainServer = `${$window.location.protocol}\/\/${$window.location.hostname}${port}`;
    const domainServer = "http://localhost:52102"; //"http://localhost";
    var appRoot = "";
    var appConfig = {
      domain: domainServer,
      appRoot: appRoot,
      appRootUrl: domainServer + appRoot,
      imageBox: domainServer + appRoot + "/assets/images",
      appKey: "lposts",
      logApiUrl: domainServer + appRoot,
      hasSearchArea: true,
      truncateLimit: 150,
      ImageUploadQuota: 2,
      requestTimeout: 30000,
      loggingEnabled: true,
      socialRedirectUrl: "http%3A%2F%2Flocalhost%2Fzposts%2Fhome%2Fsociallogin",
      enableParallax: false,
      statePage: "GATE", // "bioagency"
      disableSearch: false,
      isDevMode: true,
      recaptchakey: "6LcoQaEUAAAAAHJRoFLpeBCBmgMfjscjIZq87xU2"
    };

    var imageBox = appConfig.imageBox;
    appConfig.logoImg = `${imageBox}/newLogoX.png`;

    appConfig.heroImages = [{
        imgSrc: `${imageBox}/neighborhood.jpg`, ///bgMain.png`,
        id: 1,
        title: "Local posts by your local community",
        desc: "For your local services, news, talents, events and more. Find it here!."
      },
      {
        imgSrc: `${imageBox}/zhero2.png`,
        id: 2,
        title: "Bring Your Ideas To Life",
        desc: "Find  freelance creatives near you."
      }
    ];
    var bins = [{
        id: 1,
        name: "News",
        imgUrl: `${imageBox}/ZP-Photography-Icon.png`,
        desc: "Design, Photography, Musics etc",
        searchTag: "news"
      },
      {
        id: 2,
        name: "Entertainment",
        imgUrl: `${imageBox}/ZP-Food-Icon.png`,
        desc: "Cakes, Catering etc",
        searchTag: "entertainment"
      },
      {
        id: 3,
        name: "Events",
        imgUrl: `${imageBox}/ZP-Hair-Icon.png`,
        desc: "Hair, Nails etc",
        searchTag: "events"
      },
      {
        id: 4,
        name: "Health & Fitness",
        imgUrl: `${imageBox}/eyelash.png`,
        desc: "",
        searchTag: "healtn_lifestyle"
      },
      {
        id: 5,
        name: "Food & Drink",
        imgUrl: `${imageBox}/ZP-Events-Icon.png`,
        desc: "",
        searchTag: "food_drink"
      },
      {
        id: 6,
        name: "Money",
        imgUrl: `${imageBox}/ZP-Graphics-and-Design-Icon.png`,
        desc: "",
        searchTag: "money"
      },
      {
        id: 7,
        name: "Jobs",
        imgUrl: `${imageBox}/ZP-Fun-and-Lifestyle-Icon.png`,
        desc: "",
        searchTag: "jobs"
      },
      {
        id: 8,
        name: "Kids",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "Kids"
      },

      {
        id: 9,
        name: "Property",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "property"
      },

      {
        id: 10,
        name: "For Sale",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "for_sale"
      },
      {
        id: 11,
        name: "Freebies",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "freebies"
      },
      {
        id: 11,
        name: "Services",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "freebies"
      },
      {
        id: 12,
        name: "Discussions",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "discussions"
      },
      {
        id: 13,
        name: "Blogs",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "blogs"
      },
      {
        id: 999,
        isDefault: true,
        name: "Miscellaneous",
        imgUrl: `${imageBox}/ZP-Fashion-Icon.png`,
        desc: "",
        searchTag: "Miscellaneous"
      }
    ];

    var mediaTypes = [{
        id: 0,
        name: "Poster"
      },
      {
        id: 1,
        name: "Detail"
      }
    ];

    var feature_level1 = [{
        FeatureImageString: `https://picsum.photos/200/300?random`,
        Id: 2,
        Title: "Test 1",
        Text: "Praesent commodo cursus magna",
        BinName: bins[2].name,
        BinId: bins[2].id
      },
      {
        FeatureImageString: "https://picsum.photos/200/300?image=10",
        Id: 3,
        Title: "Test 1",
        Text: "Praesent commodo cursus magna",
        BinName: bins[0].name,
        BinId: bins[0].id
      },
      ///  960x640
      //'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/D2ROMCUEIV.jpg'
      //'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/PU9HHZB5QW.jpg'
      {
        FeatureImageString: "https://picsum.photos/200/300?image=12",
        Id: 11,
        Title: "Test 1",
        Text: "Praesent commodo cursus magna",
        BinName: bins[4].name,
        BinId: bins[4].id
      },
      {
        FeatureImageString: "https://picsum.photos/200/300?image=7",
        Id: 0,
        Title: "Test 1",
        Text: "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
        BinName: bins[5].name,
        BinId: bins[5].id
      },
      {
        FeatureImageString: "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/PU9HHZB5QW.jpg",
        Id: 1,
        Title: "Test 2",
        Text: "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
        BinName: bins[1].name,
        BinId: bins[1].id
      }
    ];
    const feature_level2 = [{
        FeatureImageString: "https://picsum.photos/600/450/?random", ///bgMain.png`,
        Id: 1,
        Title: "Local posts by your local community",
        Text: "For your local services, news, talents, events and more. Find it here!.",
        BinName: bins[0].name,
        BinId: bins[0].id
      },
      {
        FeatureImageString: "https://picsum.photos/654/450/?random",
        Id: 2,
        Title: "Bring Your Ideas To Life",
        Text: "Find  freelance creatives near you.",
        BinName: bins[3].name,
        BinId: bins[3].id
      },
      {
        FeatureImageString: "https://picsum.photos/670/450/?random",
        Id: 3,
        Title: "Bring Your Ideas To Life",
        Text: "Find  freelance creatives near you.",
        BinName: bins[2].name,
        BinId: bins[2].id
      }
    ];

    const feature_level3 = [{
        FeatureImageString: "",
        Id: 1,
        Title: "Local posts by your local community",
        Text: "For your local services, news, talents, events and more. Find it here!.",
        BinName: bins[2].name
      },
      {
        FeatureImageString: "",
        Id: 2,
        Title: "Local posts by your local community",
        Text: "For your local services, news, talents, events and more. Find it here!.",
        BinName: bins[4].name
      },

      {
        FeatureImageString: "",
        Id: 3,
        Title: "Local posts by your local community",
        Text: "For your local services, news, talents, events and more. Find it here!.",
        BinName: bins[3].name
      }
    ];

    // const feature_level3 = [{
    //     FeatureImageString: `${imageBox}/neighborhood.jpg`, ///bgMain.png`,
    //     id: 1,
    //     Title: "Local posts by your local community",
    //     Text: "For your local services, news, talents, events and more. Find it here!.",
    //     bin: "Events"
    //   },
    //   {
    //     imgSrc: `${imageBox}/zhero2.png`,
    //     id: 2,
    //     title: "Bring Your Ideas To Life",
    //     desc: "Find  freelance creatives near you."
    //   }
    // ]

    //#d5dbdb
    $scope.options = {
      useHeaderImage: true,
      mainContainerId: "#lposts12",
      countryCode: "GB",
      countryName: "England",
      appConfig: appConfig,
      bins: bins,
      canSearchMultiRegion: true,
      notifications: {
        error: {
          msg: "Something went wrong",
          title: "Oops!"
        }
      },
      sitemap: {
        all: {
          images: {
            maxWidth: '35em'
          }
        },
        gate: {
          isVisible: false,
          btnEnterText: "Enter",
          tagLine: "Promoting Local Awareness",
          logoText: ["LP", "o", "s", "t", "s"],
          message: "Your postcode helps us to collate the most relevant posts from your area of interest"
        },
        home: {
          numBinSection: [1, 2, 4, 6, 7],
          siteAd: {
            waterMarkingText: "LPOSTS",
            btnText: "Sign up",
            title: "LPOSTS IT",
            desc: "Join us in promoting local awareness"
          }
        },
        detail: {},
        lisitng: {},
        addPost: {
          featureDuration: 7, //valid for 7 days
          pageTitle: "Add Post",
          category: {
            title: "Category"
          },
          postType: {
            title: "Type of post"
          }
        },
        settings: {
          pageText: "Settings",
          logoutText: "Sign Out",
          loginText: "Sign In",
          links: [{
              title: "My Profile",
              url: "ManageProfile"
            },
            {
              title: "My Posts",
              url: "ManagePosts"
            }
          ]
        }
      },
      fetchPostLimit: 20,
      binExtraLimit: 10,
      isAutoExtend: false,
      showPostOnBins: true,
      tagAllowance: 5,
      mediaTypes: mediaTypes,
      featured: {
        title: {
          level1: {
            primary: "Popular Posts",
            secondary: "ACTIVITES, EVENTS, RESTAURANTS & More"
          },
          level2: {
            primary: "Posts From Your Area",
            secondary: "WORKSHOPS, TALKS, ACIVITES & MORE"
          }
        },
        posts: {
          level1: feature_level1,
          level2: feature_level2,
          level3: feature_level3
        },
        single: {
          FeatureImageString: "https://picsum.photos/200/300/?random",
          Id: 1,
          Title: "Local posts by your local community",
          Text: "For your local services, news, talents, events and more. Find it here!.",
          BinName: "Education",
          BinId: bins[2].id
        }
      },
      listingLimitMsg: "Allowance reached.  Goto setttings and delete a post or upgrade subscription ",
      showRibbons: false,
      style: {
        featureViewerBgColor: "blue",
        mainBgColor: "#fff"
      },
      externLoginInfo: {
        // Token:  12345,
        // HasAccount: true,
        // Provider: "Google",
        // Email: "leslie.ashman.co.uk"
      }
    };
  }
]);
