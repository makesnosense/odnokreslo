import type { YMapLocationRequest } from "@yandex/ymaps3-types";

declare global {
  interface Window {
    ymaps3: typeof ymaps3;
  }
}

const ensureYmaps3Ready = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkYmapsLoaded = () => {
      if (window.ymaps3) {
        ymaps3.ready.then(resolve);
      } else {
        setTimeout(checkYmapsLoaded, 50);
      }
    };
    checkYmapsLoaded();
  });
};

export const initializeMap = async () => {
  await ensureYmaps3Ready();

  ymaps3.import.registerCdn(
    "https://cdn.jsdelivr.net/npm/{package}",
    "@yandex/ymaps3-default-ui-theme@0.0.24",
  );

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapControls,
    YMapDefaultFeaturesLayer,
  } = ymaps3;

  const { YMapZoomControl, YMapDefaultMarker } = await ymaps3.import(
    "@yandex/ymaps3-default-ui-theme",
  );

  const mapContainer = document.querySelector<HTMLElement>(
    ".location-section .map-container",
  );
  const mapElement = document.querySelector<HTMLElement>(
    ".location-section .map",
  );
  const toggleBtn = document.querySelector<HTMLButtonElement>(
    ".location-section .map-toggle-btn",
  );
  const mapHint = document.querySelector<HTMLElement>(
    ".location-section .map-hint",
  );
  const openMapsBtn = document.querySelector<HTMLElement>(
    ".yandex-open-maps-btn",
  );

  if (!mapContainer || !mapElement || !toggleBtn || !mapHint || !openMapsBtn) {
    throw new Error("Not all of the map elements are present");
  }

  const toggleButtonAnimations =
    toggleBtn.querySelectorAll<SVGAnimateElement>(".colored-animation");

  if (!toggleButtonAnimations) {
    throw new Error("Toggle button animation elements is not found");
  }

  const MAP_CENTER: YMapLocationRequest = {
    center: [37.584, 55.7542],
    zoom: 14,
  };

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // hide button on desktop
  if (!isTouchDevice) {
    toggleBtn.style.display = "none";
  }

  const map = new YMap(
    mapElement,
    {
      location: MAP_CENTER,
      copyrightsPosition: "bottom right",
      behaviors: isTouchDevice ? [] : ["drag"],
    },
    [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})],
  );

  const controls = new YMapControls({ position: "right" });
  controls.addChild(new YMapZoomControl({ easing: "ease-in-out" }));
  map.addChild(controls);

  const salonMarker = new YMapDefaultMarker({
    coordinates: [37.579055, 55.753136],
    iconName: "hairdressers",
    title: "ОДНО КРЕСЛО",
    subtitle: "Новый Арбат, 34с1",
    color: "silver",
    size: "normal",
    onClick: () => {
      window.open(
        "https://yandex.ru/maps/-/CLbwQ87U",
        "_blank",
        "noopener,noreferrer",
      );
    },
  });

  map.addChild(salonMarker);

  // toggle logic for mobile
  if (isTouchDevice) {
    let isMapActive = false;
    let hintTimeout: number | null = null;

    // initially, map doesn't intercept touches
    mapElement.style.pointerEvents = "none";

    const showHint = () => {
      mapHint.classList.add("visible");
      mapElement.classList.add("blurred");

      toggleButtonAnimations.forEach((animation) => animation.beginElement());

      if (hintTimeout) {
        clearTimeout(hintTimeout);
      }
      hintTimeout = window.setTimeout(() => {
        mapHint.classList.remove("visible");
        mapElement.classList.remove("blurred");
        toggleButtonAnimations.forEach((animation) => animation.endElement());
      }, 2000);
    };

    const hideHint = () => {
      mapHint.classList.remove("visible");
      mapElement.classList.remove("blurred");
      toggleButtonAnimations.forEach((animation) => animation.endElement());
      if (hintTimeout) {
        clearTimeout(hintTimeout);
        hintTimeout = null;
      }
    };

    mapContainer.addEventListener("touchstart", (event) => {
      if (!isMapActive) {
        const target = event.target as HTMLElement;
        if (!target.closest("button")) {
          showHint();
        }
      }
    });

    const toggleMapInteraction = () => {
      isMapActive = !isMapActive;
      hideHint();

      if (isMapActive) {
        // enable map interaction, disable page scroll
        map.setBehaviors(["drag", "pinchZoom"]);
        mapElement.style.pointerEvents = "auto";
        mapElement.style.touchAction = "none";

        mapElement.classList.remove("grayscale");
        openMapsBtn.classList.remove("grayscale");
        toggleBtn.classList.add("enabled");
      } else {
        // disable map interaction, enable page scroll
        map.setBehaviors([]);
        mapElement.style.pointerEvents = "none";
        mapElement.style.touchAction = "auto";
        mapElement.classList.add("grayscale");
        openMapsBtn.classList.add("grayscale");
        toggleBtn.classList.remove("enabled");
      }
    };

    toggleBtn.addEventListener("click", toggleMapInteraction);
  }
};
