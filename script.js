
const challenges = [
    {
        reactants: ["2Na", "Cl₂"],
        formula: "NaCl",
        name: "Natriy xlorid",
        equation: "2Na + Cl₂ → 2NaCl",
        info: "Natriy va xlor reaksiyasidan osh tuzining asosiy tarkibiy moddasi hosil bo‘ladi."
    },
    {
        reactants: ["H₂", "O₂"],
        formula: "H2O",
        name: "Suv",
        equation: "2H₂ + O₂ → 2H₂O",
        info: "Vodorod kislorod bilan reaksiyaga kirishib suv hosil qiladi."
    },
    {
        reactants: ["Mg", "O₂"],
        formula: "MgO",
        name: "Magniy oksid",
        equation: "2Mg + O₂ → 2MgO",
        info: "Magniy kislorod bilan birikib magniy oksid hosil qiladi."
    },
    {
        reactants: ["Ca", "O₂"],
        formula: "CaO",
        name: "Kalsiy oksid",
        equation: "2Ca + O₂ → 2CaO",
        info: "Kalsiy kislorod bilan reaksiyaga kirishganda kalsiy oksid hosil bo‘ladi."
    },
    {
        reactants: ["H₂", "Cl₂"],
        formula: "HCl",
        name: "Vodorod xlorid",
        equation: "H₂ + Cl₂ → 2HCl",
        info: "Vodorod va xlor birikib vodorod xlorid hosil qiladi."
    },
    {
        reactants: ["Fe", "S"],
        formula: "FeS",
        name: "Temir sulfidi",
        equation: "Fe + S → FeS",
        info: "Temir va oltingugurt reaksiyasidan temir sulfidi hosil bo‘ladi."
    },
    {
        reactants: ["C", "O₂"],
        formula: "CO2",
        name: "Karbonat angidrid",
        equation: "C + O₂ → CO₂",
        info: "Uglerod kislorodda to‘liq yonganda karbonat angidrid hosil bo‘ladi."
    },
    {
        reactants: ["N₂", "H₂"],
        formula: "NH3",
        name: "Ammiak",
        equation: "N₂ + 3H₂ → 2NH₃",
        info: "Azot va vodorod reaksiyasidan ammiak hosil bo‘ladi."
    },
    {
        reactants: ["Mg", "Cl₂"],
        formula: "MgCl2",
        name: "Magniy xlorid",
        equation: "Mg + Cl₂ → MgCl₂",
        info: "Magniy xlor bilan birikib magniy xlorid hosil qiladi."
    },
    {
        reactants: ["Al", "O₂"],
        formula: "Al2O3",
        name: "Alyuminiy oksid",
        equation: "4Al + 3O₂ → 2Al₂O₃",
        info: "Alyuminiy kislorod bilan reaksiyaga kirishib alyuminiy oksid hosil qiladi."
    }
];

const availableElements = [
    "Na", "Cl", "H", "O", "Mg", "Ca",
    "Fe", "S", "C", "N", "Al", "K",
    "2", "3"
];

let current = 0;
let score = 0;
let selected = "";
let locked = false;

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}

function startGame() {
    current = 0;
    score = 0;

    document.getElementById("score").textContent = score;
    document.getElementById("points").textContent = score;

    showScreen("game");
    loadChallenge();
}

function formatFormula(formula) {
    return formula.replace(/(\d+)/g, digit => {
        return digit.replace(/[0-9]/g, n => "₀₁₂₃₄₅₆₇₈₉"[Number(n)]);
    });
}

function loadChallenge() {
    locked = false;
    selected = "";

    const task = challenges[current];

    document.getElementById("level").textContent =
        `${current + 1} / ${challenges.length}`;

    document.getElementById("progress").style.width =
        (current / challenges.length * 100) + "%";

    document.getElementById("points").textContent = score;
    document.getElementById("builtFormula").textContent = "?";
    document.getElementById("feedback").textContent = "";
    document.getElementById("nextBtn").classList.add("hidden");

    const reactants = document.getElementById("reactants");
    reactants.innerHTML = "";

    task.reactants.forEach((item, index) => {
        const element = document.createElement("div");
        element.className = "reactant";
        element.textContent = item;
        reactants.appendChild(element);

        if (index < task.reactants.length - 1) {
            const plus = document.createElement("span");
            plus.className = "plus";
            plus.textContent = "+";
            reactants.appendChild(plus);
        }
    });

    renderElements();
}

function renderElements() {
    const box = document.getElementById("elements");
    box.innerHTML = "";

    const formulaTokens = challenges[current].formula.match(
        /[A-Z][a-z]?|\d+/g
    );

    const choices = [...new Set([
        ...formulaTokens,
        ...availableElements.slice(0, 12),
        "2", "3"
    ])];

    choices.forEach(symbol => {
        const btn = document.createElement("button");
        btn.className = "element-btn";

        btn.innerHTML = `
            ${formatFormula(symbol)}
            <small>${/^\d+$/.test(symbol) ? "Indeks" : "Element"}</small>
        `;

        btn.onclick = () => addElement(symbol);

        box.appendChild(btn);
    });
}

function addElement(symbol) {
    if (locked) return;

    selected += symbol;

    document.getElementById("builtFormula").textContent =
        formatFormula(selected);
}

function clearFormula() {
    if (locked) return;

    selected = "";
    document.getElementById("builtFormula").textContent = "?";
    document.getElementById("feedback").textContent = "";
}

function checkFormula() {
    if (locked) return;

    const task = challenges[current];
    const feedback = document.getElementById("feedback");

    if (selected === "") {
        feedback.textContent = "⚠️ Avval elementlarni tanlang!";
        feedback.style.color = "#ffca55";
        return;
    }

    locked = true;

    if (selected === task.formula) {
        score += 10;

        document.getElementById("points").textContent = score;
        document.getElementById("score").textContent = score;

        feedback.innerHTML =
            `✅ TO‘G‘RI! ${task.name}<br>
            ${task.info}<br>
            <b>Tenglama: ${task.equation}</b>`;

        feedback.style.color = "#00ffa2";
    } else {
        feedback.innerHTML =
            `❌ Noto‘g‘ri! To‘g‘ri formula: <b>${formatFormula(task.formula)}</b><br>
            Modda: ${task.name}<br>
            <b>Tenglama: ${task.equation}</b><br>
            ${task.info}`;

        feedback.style.color = "#ff718c";
    }

    document.getElementById("builtFormula").textContent =
        formatFormula(selected);

    document.getElementById("nextBtn").classList.remove("hidden");

    document.getElementById("nextBtn").textContent =
        current === challenges.length - 1
        ? "NATIJANI KO‘RISH 🏆"
        : "KEYINGI TOPSHIRIQ ➜";
}

function nextQuestion() {
    current++;

    if (current >= challenges.length) {
        finishGame();
    } else {
        loadChallenge();
    }
}

function finishGame() {
    showScreen("result");

    document.getElementById("finalScore").textContent =
        score + " / 100";

    let message;

    if (score === 100) {
        message = "🌟 Ajoyib! Siz haqiqiy kimyo bilimdonisiz!";
    } else if (score >= 70) {
        message = "👏 Juda yaxshi natija!";
    } else if (score >= 40) {
        message = "👍 Yaxshi! Yana mashq qiling.";
    } else {
        message = "📚 Kimyoviy formulalarni yana o‘rganing!";
    }

    document.getElementById("message").textContent = message;
}

function goHome() {
    showScreen("home");
}
