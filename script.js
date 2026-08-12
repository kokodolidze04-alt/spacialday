document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =========================
       LOADER
    ========================= */

    const loader =
      document.getElementById("loader");


    if (loader) {

      setTimeout(() => {

        loader.classList.add("hidden");

      }, 500);

    }


    /* =========================
       SCROLL REVEAL
    ========================= */

    const revealItems =
      document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

      const observer =
        new IntersectionObserver(
          (entries) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target.classList.add(
                    "visible"
                  );

                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold: 0.12
          }
        );


      revealItems.forEach(
        (item) => {

          observer.observe(item);

        }
      );

    } else {

      revealItems.forEach(
        (item) => {

          item.classList.add(
            "visible"
          );

        }
      );

    }


    /* =========================
       ROSE PETALS
    ========================= */

    const petals =
      document.querySelector(".petals");


    let petalCount = 0;

    const maxPetals = 25;


    function createPetal() {

      if (!petals) {
        return;
      }


      if (
        petalCount >= maxPetals
      ) {
        return;
      }


      const petal =
        document.createElement("span");


      petal.className =
        "petal";


      const size =
        10 + Math.random() * 9;


      petal.style.width =
        `${size}px`;


      petal.style.height =
        `${size * 1.35}px`;


      petal.style.left =
        `${Math.random() * 100}vw`;


      petal.style.setProperty(
        "--drift",
        `${Math.random() * 260 - 130}px`
      );


      petal.style.animationDuration =
        `${6 + Math.random() * 7}s`;


      petal.style.opacity =
        `${.55 + Math.random() * .4}`;


      petals.appendChild(petal);


      petalCount++;


      setTimeout(
        () => {

          petal.remove();

          petalCount--;

        },
        15000
      );

    }


    for (
      let i = 0;
      i < 7;
      i++
    ) {

      setTimeout(
        createPetal,
        i * 250
      );

    }


    setInterval(
      createPetal,
      800
    );


    /* =========================
       WEDDING MUSIC
    ========================= */

    const music =
      document.getElementById(
        "weddingMusic"
      );


    const musicBtn =
      document.getElementById(
        "musicBtn"
      );


    const musicIcon =
      musicBtn?.querySelector(
        ".music-icon"
      );


    let playing = false;


    /*
      ცდილობს ავტომატურად ჩართვას
      გვერდის გახსნისას.
    */

    async function startMusic() {

      if (
        !music ||
        playing
      ) {
        return;
      }


      try {

        music.volume = 1;

        await music.play();

        playing = true;


        if (musicIcon) {

          musicIcon.textContent =
            "Ⅱ";

        }


        musicBtn?.classList.add(
          "playing"
        );


      } catch (error) {

        /*
          Chrome / Edge / Safari-მ
          autoplay შეიძლება დაბლოკოს.

          ასეთ შემთხვევაში პირველი
          click/touch ავტომატურად ჩართავს.
        */

        console.log(
          "Autoplay blocked:",
          error
        );

      }

    }


    /*
      პირველი მცდელობა —
      პირდაპირ გვერდის გახსნისას.
    */

    startMusic();


    /*
      თუ autoplay დაიბლოკა,
      პირველი შეხება/დაკლიკება/კლავიატურა
      ჩართავს მუსიკას.
    */

    let interactionUnlocked =
      false;


    async function unlockMusic() {

      if (
        interactionUnlocked ||
        playing
      ) {
        return;
      }


      interactionUnlocked = true;

      await startMusic();

    }


    document.addEventListener(
      "click",
      unlockMusic,
      {
        once: true,
        passive: true
      }
    );


    document.addEventListener(
      "touchstart",
      unlockMusic,
      {
        once: true,
        passive: true
      }
    );


    document.addEventListener(
      "keydown",
      unlockMusic,
      {
        once: true
      }
    );


    /*
      Music ღილაკი —
      ხელით ჩართვა / გამორთვა.
    */

    if (musicBtn) {

      musicBtn.addEventListener(
        "click",
        async (event) => {

          event.stopPropagation();


          if (!music) {
            return;
          }


          try {

            if (playing) {

              music.pause();

            } else {

              await music.play();

            }

          } catch (error) {

            console.error(
              "Music playback error:",
              error
            );

          }

        }
      );

    }


    music?.addEventListener(
      "play",
      () => {

        playing = true;


        if (musicIcon) {

          musicIcon.textContent =
            "Ⅱ";

        }


        musicBtn?.classList.add(
          "playing"
        );

      }
    );


    music?.addEventListener(
      "pause",
      () => {

        playing = false;


        if (musicIcon) {

          musicIcon.textContent =
            "♫";

        }


        musicBtn?.classList.remove(
          "playing"
        );

      }
    );

    /* =========================================================
   INTERACTIVE LOCATION MAPS
========================================================= */

const locationCards =
  document.querySelectorAll(
    ".location-card:not(.no-map)"
  );


locationCards.forEach(
  (card) => {

    const map =
      card.querySelector(
        ".location-map"
      );

    const iframe =
      map?.querySelector(
        "iframe"
      );

    const mapOpen =
      map?.querySelector(
        ".map-open"
      );


    const location =
      card.dataset.location;


    if (
      !map ||
      !iframe ||
      !location
    ) {
      return;
    }


    let mapLoaded =
      false;


    card.addEventListener(
      "click",
      (event) => {

        /*
          თუ Google Maps-ის ღილაკს დააჭირა,
          ბარათის დაკეცვა არ მოხდეს.
        */

        if (
          event.target.closest(
            ".map-open"
          )
        ) {
          return;
        }


        const isOpen =
          card.classList.contains(
            "active"
          );


        /*
          სხვა გახსნილი რუკები დავკეცოთ
        */

        locationCards.forEach(
          (otherCard) => {

            if (
              otherCard !== card
            ) {

              otherCard.classList.remove(
                "active"
              );

            }

          }
        );


        /*
          მიმდინარე ბარათი
        */

        if (isOpen) {

          card.classList.remove(
            "active"
          );

          return;

        }


        card.classList.add(
          "active"
        );


        /*
          iframe მხოლოდ პირველი გახსნისას
          ჩაიტვირთოს.
        */

        if (!mapLoaded) {

          const encodedLocation =
            encodeURIComponent(
              location
            );


          const mapURL =
            `https://www.google.com/maps?q=${encodedLocation}&output=embed`;


          iframe.src =
            mapURL;


          if (mapOpen) {

            mapOpen.href =
              `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

          }


          iframe.addEventListener(
            "load",
            () => {

              mapLoaded =
                true;

              map.classList.add(
                "loaded"
              );

            },
            {
              once: true
            }
          );

        }

      }
    );

  }
);

    /* =========================
       COUNTDOWN
    ========================= */

    const weddingDate =
      new Date(
        "2026-08-29T00:00:00+04:00"
      ).getTime();


    const daysEl =
      document.getElementById(
        "days"
      );


    const hoursEl =
      document.getElementById(
        "hours"
      );


    const minutesEl =
      document.getElementById(
        "minutes"
      );


    const secondsEl =
      document.getElementById(
        "seconds"
      );


    function pad(value) {

      return String(value)
        .padStart(2, "0");

    }


    function updateWeddingCountdown() {

      const difference =
        weddingDate -
        Date.now();


      if (
        difference <= 0
      ) {

        daysEl.textContent =
          "00";

        hoursEl.textContent =
          "00";

        minutesEl.textContent =
          "00";

        secondsEl.textContent =
          "00";

        return;

      }


      const days =
        Math.floor(
          difference /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      const hours =
        Math.floor(
          (
            difference /
            (
              1000 *
              60 *
              60
            )
          ) % 24
        );


      const minutes =
        Math.floor(
          (
            difference /
            (
              1000 *
              60
            )
          ) % 60
        );


      const seconds =
        Math.floor(
          (
            difference /
            1000
          ) % 60
        );


      daysEl.textContent =
        pad(days);

      hoursEl.textContent =
        pad(hours);

      minutesEl.textContent =
        pad(minutes);

      secondsEl.textContent =
        pad(seconds);

    }


    updateWeddingCountdown();


    setInterval(
      updateWeddingCountdown,
      1000
    );

  }
);