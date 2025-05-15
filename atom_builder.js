// JavaScript for Atom Builder page

document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements for Atom Builder
    const addProtonButton = document.getElementById("add-proton-button");
    const addNeutronButton = document.getElementById("add-neutron-button");
    const addElectronButton = document.getElementById("add-electron-button");
    const removeProtonButton = document.getElementById("remove-proton-button");
    const removeNeutronButton = document.getElementById("remove-neutron-button");
    const removeElectronButton = document.getElementById("remove-electron-button");
    const protonCountElement = document.getElementById("proton-count");
    const neutronCountElement = document.getElementById("neutron-count");
    const electronCountElement = document.getElementById("electron-count");
    const elementMessageElement = document.getElementById("element-message");
    const atomBuilderNucleus = document.querySelector(".atom-builder-nucleus");
    const atomBuilderModel = document.querySelector(".atom-builder-model"); // Container for orbits and electrons
    const langButtons = document.querySelectorAll(".lang-btn"); // Language buttons in header

    // Particle Limits
    const MAX_PROTONS = 20;
    const MAX_NEUTRONS = 25;
    const MAX_ELECTRONS = 18; // Based on 2, 8, 8 shell capacity

    // Shell Capacities
    const SHELL_CAPACITIES = [2, 8, 8];

    let protonCount = 0;
    let neutronCount = 0;
    let electronCount = 0;
    let currentLang = "en"; // Default language
    let electrons = []; // Array to keep track of electron elements and their shells
    let animationFrameId = null; // For animation frame

    // Language data
    const translations = {
        en: {
            title: "FUNDAMENTAL PARTICLES",
            back: "← Back",
            atomBuilderTitle: "Atom Builder",
            addProton: "Add Proton",
            removeProton: "Remove Proton",
            addNeutron: "Add Neutron",
            removeNeutron: "Remove Neutron",
            addElectron: "Add Electron",
            removeElectron: "Remove Electron",
            protonsLabel: "Protons:",
            neutronsLabel: "Neutrons:",
            electronsLabel: "Electrons:",
            elementBuiltMsg: "You've built {elementName} ({elementSymbol})!",
            copyright: "© 2025 FUNDAMENTAL PARTICLES. All rights reserved.",
            madeWith: "Made with Manus",
            maxProtonsMsg: `Maximum ${MAX_PROTONS} protons reached.`,
            maxNeutronsMsg: `Maximum ${MAX_NEUTRONS} neutrons reached.`,
            maxElectronsMsg: `Maximum ${MAX_ELECTRONS} electrons reached (Shells full).`,
            neutralAtomBuiltMsg: "You've built a neutral {elementName} ({elementSymbol}) atom!",
            ionBuiltMsg: "You've built a {elementName} ({elementSymbol}) ion with charge {charge}!",
            isotopeBuiltMsg: "You've built an isotope: {elementName}-{massNumber} ({elementSymbol})!",
            isotopeIonBuiltMsg: "You've built an ion of the isotope {elementName}-{massNumber} ({elementSymbol}) with charge {charge}!",
            neutralIsotopeBuiltMsg: "You've built a neutral isotope: {elementName}-{massNumber} ({elementSymbol})!"
        },
        bs: {
            title: "FUNDAMENTALNE ČESTICE",
            back: "← Nazad",
            atomBuilderTitle: "Graditelj Atoma",
            addProton: "Dodaj Proton",
            removeProton: "Ukloni Proton",
            addNeutron: "Dodaj Neutron",
            removeNeutron: "Ukloni Neutron",
            addElectron: "Dodaj Elektron",
            removeElectron: "Ukloni Elektron",
            protonsLabel: "Protoni:",
            neutronsLabel: "Neutroni:",
            electronsLabel: "Elektroni:",
            elementBuiltMsg: "Napravili ste {elementName} ({elementSymbol})!",
            copyright: "© 2025 FUNDAMENTALNE ČESTICE. Sva prava zadržana.",
            madeWith: "Napravljeno sa Manus",
            maxProtonsMsg: `Dostignut maksimalan broj od ${MAX_PROTONS} protona.`,
            maxNeutronsMsg: `Dostignut maksimalan broj od ${MAX_NEUTRONS} neutrona.`,
            maxElectronsMsg: `Dostignut maksimalan broj od ${MAX_ELECTRONS} elektrona (Ljuske pune).`,
            neutralAtomBuiltMsg: "Napravili ste neutralni atom {elementName} ({elementSymbol})!",
            ionBuiltMsg: "Napravili ste ion {elementName} ({elementSymbol}) sa nabojem {charge}!",
            isotopeBuiltMsg: "Napravili ste izotop: {elementName}-{massNumber} ({elementSymbol})!",
            isotopeIonBuiltMsg: "Napravili ste ion izotopa {elementName}-{massNumber} ({elementSymbol}) sa nabojem {charge}!",
            neutralIsotopeBuiltMsg: "Napravili ste neutralni izotop: {elementName}-{massNumber} ({elementSymbol})!"
        },
        tr: {
            title: "TEMEL PARÇACIKLAR",
            back: "← Geri",
            atomBuilderTitle: "Atom Oluşturucu",
            addProton: "Proton Ekle",
            removeProton: "Proton Kaldır",
            addNeutron: "Nötron Ekle",
            removeNeutron: "Nötron Kaldır",
            addElectron: "Elektron Ekle",
            removeElectron: "Elektron Kaldır",
            protonsLabel: "Protonlar:",
            neutronsLabel: "Nötronlar:",
            electronsLabel: "Elektronlar:",
            elementBuiltMsg: "{elementName} ({elementSymbol}) oluşturdunuz!",
            copyright: "© 2025 TEMEL PARÇACIKLAR. Tüm hakları saklıdır.",
            madeWith: "Manus ile yapıldı",
            maxProtonsMsg: `Maksimum ${MAX_PROTONS} protona ulaşıldı.`,
            maxNeutronsMsg: `Maksimum ${MAX_NEUTRONS} nötrona ulaşıldı.`,
            maxElectronsMsg: `Maksimum ${MAX_ELECTRONS} elektrona ulaşıldı (Kabuklar dolu).`,
            neutralAtomBuiltMsg: "Nötr bir {elementName} ({elementSymbol}) atomu oluşturdunuz!",
            ionBuiltMsg: "{charge} yüklü bir {elementName} ({elementSymbol}) iyonu oluşturdunuz!",
            isotopeBuiltMsg: "Bir izotop oluşturdunuz: {elementName}-{massNumber} ({elementSymbol})!",
            isotopeIonBuiltMsg: "{charge} yüklü {elementName}-{massNumber} ({elementSymbol}) izotopunun bir iyonunu oluşturdunuz!",
            neutralIsotopeBuiltMsg: "Nötr bir izotop oluşturdunuz: {elementName}-{massNumber} ({elementSymbol})!"
        }
    };

    // Function to update language
    function updateLanguage(lang) {
        if (!translations[lang]) {
            console.error(`[Lang] Invalid language: ${lang}`);
            return;
        }
        currentLang = lang;
        langButtons.forEach(btn => {
            btn.style.border = (btn.getAttribute("data-lang") === lang) ? "2px solid #3498db" : "1px solid #ddd";
        });
        const elementsToTranslate = document.querySelectorAll("[data-translate-key]");
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute("data-translate-key");
            let translationText = translations[lang][key];
            if (key === "elementBuiltMsg" && elementMessageElement.dataset.elementName) {
                // Defer update
            } else if (translationText !== undefined) {
                element.textContent = translationText;
            } else {
                console.warn(`[Lang] Key '${key}' not found for '${lang}'. Falling back.`);
                const fallbackText = translations["en"][key];
                if (fallbackText !== undefined && !(key === "elementBuiltMsg" && elementMessageElement.dataset.elementName)) {
                    element.textContent = fallbackText;
                } else if (!fallbackText) {
                     console.error(`[Lang] Key '${key}' not found in English.`);
                }
            }
        });
        checkElement();
    }

    // --- Atom Builder Logic ---

    addProtonButton.addEventListener("click", () => {
        if (protonCount >= MAX_PROTONS) {
            alert(translations[currentLang].maxProtonsMsg || translations["en"].maxProtonsMsg);
            return;
        }
        const proton = document.createElement("div");
        proton.className = "atom-builder-proton nucleon-particle";
        atomBuilderNucleus.appendChild(proton);
        protonCount++;
        protonCountElement.textContent = protonCount;
        updateNucleusSize();
        checkElement();
    });

    addNeutronButton.addEventListener("click", () => {
        if (neutronCount >= MAX_NEUTRONS) {
            alert(translations[currentLang].maxNeutronsMsg || translations["en"].maxNeutronsMsg);
            return;
        }
        const neutron = document.createElement("div");
        neutron.className = "atom-builder-neutron nucleon-particle";
        atomBuilderNucleus.appendChild(neutron);
        neutronCount++;
        neutronCountElement.textContent = neutronCount;
        updateNucleusSize();
        checkElement();
    });

    // **FINAL** Update electron positions using JS animation and dynamic radii
    function updateElectronPositions() {
        // Calculate center based on the main model container
        const centerX = atomBuilderModel.offsetWidth / 2;
        const centerY = atomBuilderModel.offsetHeight / 2;

        // Group electrons by shell
        const electronsByShell = {};
        electrons.forEach(electron => {
            const shell = electron.shell;
            if (!electronsByShell[shell]) {
                electronsByShell[shell] = [];
            }
            electronsByShell[shell].push(electron);
        });

        // Update position for each electron
        electrons.forEach(electronInfo => {
            const element = electronInfo.element;
            const shell = electronInfo.shell;
            const shellElectrons = electronsByShell[shell] || [];
            const totalInShell = shellElectrons.length;
            const index = shellElectrons.indexOf(electronInfo);

            if (index === -1 || totalInShell === 0) return; // Skip if not found or shell is empty

            // Get the corresponding orbit element to read its current size
            const orbitElement = atomBuilderModel.querySelector(`.atom-builder-orbit-${shell}`);
            if (!orbitElement) {
                console.warn(`Orbit element for shell ${shell} not found.`);
                return;
            }

            // Get computed size of the orbit element (works responsively)
            const orbitStyle = window.getComputedStyle(orbitElement);
            const orbitWidth = parseFloat(orbitStyle.width);
            const orbitRadius = orbitWidth / 2;

            // Calculate angle based on position in shell (evenly distributed)
            const now = Date.now() / 1000; // Current time in seconds
            const speed = 1.0; // Keep increased speed
            const angleOffset = (index / totalInShell) * 2 * Math.PI; // Distribute evenly
            const angle = (now * speed + angleOffset) % (2 * Math.PI);

            // Calculate position relative to the MODEL's center using DYNAMIC radius
            const x = centerX + Math.cos(angle) * orbitRadius;
            const y = centerY + Math.sin(angle) * orbitRadius;

            // Update electron position, centering the electron on the path
            const electronSize = 15; // Match CSS
            element.style.left = `${x - electronSize / 2}px`;
            element.style.top = `${y - electronSize / 2}px`;
        });

        // Request next animation frame if we have electrons
        if (electrons.length > 0) {
            animationFrameId = requestAnimationFrame(updateElectronPositions);
        } else if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // **FINAL** Add an electron to orbit with correct shell logic
    addElectronButton.addEventListener("click", () => {
        if (electronCount >= MAX_ELECTRONS) {
            alert(translations[currentLang].maxElectronsMsg || translations["en"].maxElectronsMsg);
            return;
        }

        // Determine which shell to add to based on 2, 8, 8 rule
        let targetShell = 0;
        let electronsInShells = [0, 0, 0];
        electrons.forEach(e => {
            if (e.shell >= 1 && e.shell <= SHELL_CAPACITIES.length) {
                electronsInShells[e.shell - 1]++;
            }
        });

        for (let i = 0; i < SHELL_CAPACITIES.length; i++) {
            if (electronsInShells[i] < SHELL_CAPACITIES[i]) {
                targetShell = i + 1;
                break;
            }
        }

        if (targetShell === 0) {
            // This should only happen if MAX_ELECTRONS is reached, but check anyway
            console.error("Could not find a valid shell for the electron.");
            alert(translations[currentLang].maxElectronsMsg || translations["en"].maxElectronsMsg);
            return;
        }

        // Create electron element
        const electronElement = document.createElement("div");
        electronElement.className = "atom-builder-electron";
        electronElement.style.position = "absolute"; // Ensure absolute positioning
        atomBuilderModel.appendChild(electronElement); // Add to the main model container

        // Track electron
        electrons.push({
            element: electronElement,
            shell: targetShell
        });
        electronCount++;
        electronCountElement.textContent = electronCount;

        // Start animation or update positions
        if (!animationFrameId) {
            updateElectronPositions(); // Call immediately for initial position
            animationFrameId = requestAnimationFrame(updateElectronPositions);
        } else {
            updateElectronPositions(); // Update to re-space existing electrons
        }
        checkElement();
    });

    removeProtonButton.addEventListener("click", () => {
        if (protonCount > 0) {
            const protonToRemove = atomBuilderNucleus.querySelector(".atom-builder-proton");
            if (protonToRemove) {
                atomBuilderNucleus.removeChild(protonToRemove);
                protonCount--;
                protonCountElement.textContent = protonCount;
                updateNucleusSize();
                checkElement();
            }
        }
    });

    removeNeutronButton.addEventListener("click", () => {
        if (neutronCount > 0) {
            const neutronToRemove = atomBuilderNucleus.querySelector(".atom-builder-neutron");
            if (neutronToRemove) {
                atomBuilderNucleus.removeChild(neutronToRemove);
                neutronCount--;
                neutronCountElement.textContent = neutronCount;
                updateNucleusSize();
                checkElement();
            }
        }
    });

    // **FINAL** Remove an electron from orbit with correct shell logic
    removeElectronButton.addEventListener("click", () => {
        if (electronCount > 0) {
            let electronToRemoveInfo = null;
            let highestShell = 0;
            let removeIndex = -1;

            // Find the highest occupied shell
            for (let i = electrons.length - 1; i >= 0; i--) {
                if (electrons[i].shell > highestShell) {
                    highestShell = electrons[i].shell;
                }
            }

            // Find the last electron added to that highest shell
            for (let i = electrons.length - 1; i >= 0; i--) {
                if (electrons[i].shell === highestShell) {
                    electronToRemoveInfo = electrons[i];
                    removeIndex = i;
                    break;
                }
            }

            if (electronToRemoveInfo && electronToRemoveInfo.element) {
                atomBuilderModel.removeChild(electronToRemoveInfo.element);
                electrons.splice(removeIndex, 1);
                electronCount--;
                electronCountElement.textContent = electronCount;
                if (electrons.length === 0 && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                } else if (electrons.length > 0) {
                    updateElectronPositions(); // Update to re-space remaining electrons
                }
                checkElement();
            }
        }
    });

    // Update nucleus size
    function updateNucleusSize() {
        const totalNucleons = protonCount + neutronCount;
        let nucleusSize = 60, nucleonSize = 18, nucleonMargin = 2;
        if (totalNucleons > 0) {
            nucleusSize = Math.min(150, 60 + Math.sqrt(totalNucleons) * 10);
            const shrinkStartThreshold = 10, maxShrinkFactor = 0.5;
            let shrinkRatio = 1.0;
            const maxTotalNucleons = MAX_PROTONS + MAX_NEUTRONS;
            if (totalNucleons > shrinkStartThreshold && maxTotalNucleons > shrinkStartThreshold) {
                 const shrinkRange = maxTotalNucleons - shrinkStartThreshold;
                 shrinkRatio = Math.max(1.0 - maxShrinkFactor, 1.0 - maxShrinkFactor * (totalNucleons - shrinkStartThreshold) / shrinkRange);
            }
            nucleonSize = Math.max(6, 18 * shrinkRatio);
            nucleonMargin = Math.max(0.5, 2 * (nucleonSize / 18));
        }
        atomBuilderNucleus.style.width = `${nucleusSize}px`;
        atomBuilderNucleus.style.height = `${nucleusSize}px`;
        const nucleons = atomBuilderNucleus.querySelectorAll('.atom-builder-proton, .atom-builder-neutron');
        nucleons.forEach(nucleon => {
            nucleon.style.width = `${nucleonSize}px`;
            nucleon.style.height = `${nucleonSize}px`;
            nucleon.style.margin = `${nucleonMargin}px`;
        });
    }

    // Check element identity
    function checkElement() {
        let elementName = "", elementSymbol = "", message = "", messageKey = "";
        const commonIsotopes = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 8, 9: 10, 10: 10, 11: 12, 12: 12, 13: 14, 14: 14, 15: 16, 16: 16, 17: 18, 18: 22, 19: 20, 20: 20 };
        const elementMap = { 1: { name: "Hydrogen", symbol: "H" }, 2: { name: "Helium", symbol: "He" }, 3: { name: "Lithium", symbol: "Li" }, 4: { name: "Beryllium", symbol: "Be" }, 5: { name: "Boron", symbol: "B" }, 6: { name: "Carbon", symbol: "C" }, 7: { name: "Nitrogen", symbol: "N" }, 8: { name: "Oxygen", symbol: "O" }, 9: { name: "Fluorine", symbol: "F" }, 10: { name: "Neon", symbol: "Ne" }, 11: { name: "Sodium", symbol: "Na" }, 12: { name: "Magnesium", symbol: "Mg" }, 13: { name: "Aluminum", symbol: "Al" }, 14: { name: "Silicon", symbol: "Si" }, 15: { name: "Phosphorus", symbol: "P" }, 16: { name: "Sulfur", symbol: "S" }, 17: { name: "Chlorine", symbol: "Cl" }, 18: { name: "Argon", symbol: "Ar" }, 19: { name: "Potassium", symbol: "K" }, 20: { name: "Calcium", symbol: "Ca" } };

        if (protonCount > 0 && elementMap[protonCount]) {
            const elementData = elementMap[protonCount];
            elementName = elementData.name; elementSymbol = elementData.symbol;
            const massNumber = protonCount + neutronCount;
            const charge = protonCount - electronCount;
            const isNeutral = (charge === 0);
            const isCommonIsotope = (commonIsotopes[protonCount] === neutronCount);

            if (isNeutral && isCommonIsotope) messageKey = "neutralAtomBuiltMsg";
            else if (isNeutral && !isCommonIsotope) messageKey = "neutralIsotopeBuiltMsg";
            else if (!isNeutral && isCommonIsotope) messageKey = "ionBuiltMsg";
            else if (!isNeutral && !isCommonIsotope) messageKey = "isotopeIonBuiltMsg";
            else messageKey = "elementBuiltMsg"; // Fallback if needed

            elementMessageElement.dataset.elementName = elementName;
            elementMessageElement.dataset.elementSymbol = elementSymbol;
            elementMessageElement.dataset.massNumber = massNumber;
            elementMessageElement.dataset.charge = charge > 0 ? `+${charge}` : `${charge}`;

            let messageTemplate = translations[currentLang][messageKey] || translations["en"][messageKey];
            message = messageTemplate.replace("{elementName}", elementName).replace("{elementSymbol}", elementSymbol).replace("{massNumber}", massNumber).replace("{charge}", elementMessageElement.dataset.charge);
            elementMessageElement.textContent = message;
            elementMessageElement.style.display = "block";
        } else {
            elementMessageElement.textContent = "";
            elementMessageElement.style.display = "none";
            delete elementMessageElement.dataset.elementName; delete elementMessageElement.dataset.elementSymbol;
            delete elementMessageElement.dataset.massNumber; delete elementMessageElement.dataset.charge;
        }
    }

    // Language Switching
    langButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const lang = this.getAttribute("data-lang");
            if (currentLang !== lang) updateLanguage(lang);
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (electrons.length > 0) {
            // Re-calculate positions based on potentially new model/orbit sizes
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            updateElectronPositions(); // Recalculate positions using new sizes
            if (electrons.length > 0) animationFrameId = requestAnimationFrame(updateElectronPositions); // Restart animation
        }
    });

    // Initialize
    updateLanguage(currentLang);
    updateNucleusSize();
    checkElement();
});

