addLayer("t", {
    name: "trials",
    startData() {return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#888888",
    row: 1,
    displayRow: 0,
    resource: "",
    symbol: "T",
    position: 0,
    tooltip() {return "Trials"},
    type: "normal",
    baseResource: "",
    baseAmount() {return new Decimal(0)},
    requires: new Decimal(1),
    exponent: 1,

    challenges: {
        rows: 1,
        cols: 2,
        11: {
            name: "Null",
            challengeDescription: "This challenge affects nothing.",
            goalDescription: () => {return `${Decimal.pow(2, Decimal.pow(2, player.t.challenges[11])).toPrecision(2)} points`},
            canComplete() {
                return player.points.gte(Decimal.pow(2, Decimal.pow(2, player.t.challenges[11])))
            },
            rewardDescription: () => {return `Each completion doubles point gain and unlocks an upgrade.<br>Completions: ${player.t.challenges[11]} / 10`},
            completionLimit: 10
        },
        12: {
            name: "Less is More",
            challengeDescription: "Point gain is divided by upgrades^2, but base point gain is squared",
            goalDescription: () => {return `${tmp.t.challenges[12].goal.toPrecision(2)} points`},
            goal: () => {return [
                new Decimal(5000),
                new Decimal(25000),
                new Decimal(500000),
                new Decimal(1e14),
                new Decimal(Infinity),
                new Decimal(Infinity),
                new Decimal(Infinity),
                new Decimal(Infinity),
                new Decimal(Infinity),
                new Decimal(Infinity),
                new Decimal(Infinity),
            ][player.t.challenges[12]]},
            canComplete() {
                return player.points.gte(tmp.t.challenges[12].goal)
            },
            rewardDescription: () => {return `Each completion adds 1 to base point gain after "Original?"'s effect. Every other completion unlocks an upgrade.<br>Completions: ${player.t.challenges[12]} / 10`},
            unlocked() {return player.t.challenges[11] > 4},
            completionLimit: 10
        }
    },
    tabFormat: [
        "challenges"
    ]
})
addLayer("u", {
    name: "upgrades",
    startData() {return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF0000",
    row: 0,
    displayRow: 1,
    resource: "",
    layerShown() {return player.t.challenges[11] > 0},
    symbol: "U",
    position: 0,
    branches: ["t"],
    tooltip() {return "Upgrades"},
    type: "none",

    upgrades: {
        rows: 3,
        cols: 5,
        11: {
            fullDisplay() {return `
            <h3>+1</h3><br>
            <span>Base point gain +1.</span><br>
            <span>Currently: +${tmp.u.upgrades[11].effect.round()}</span><br>
            <br>
            <span>Cost: 10 points`},
            effect() {return new Decimal(1).mul(player.u.upgrades.includes(31) + 1)},
            canAfford() {return player.points.gte(10) && !(player.u.upgrades.includes(15))},
            pay() {player.points = player.points.sub(10)},
            unlocked() {return player.t.challenges[11] > 0}
        },
        12: {
            fullDisplay() {return `
            <h3>Unoriginal</h3><br>
            <span>Base point gain +1 again.</span><br>
            <span>Currently: +${tmp.u.upgrades[12].effect.round()}</span><br>
            <br>
            <span>Cost: 30 points`},
            effect() {return new Decimal(1).mul(player.u.upgrades.includes(31) + 1)},
            canAfford() {return player.points.gte(30) && !(player.u.upgrades.includes(15))},
            pay() {player.points = player.points.sub(30)},
            unlocked() {return player.t.challenges[11] > 1}
        },
        13: {
            fullDisplay() {return `
            <h3>This will make sense soon</h3><br>
            <span>This upgrade does nothing</span><br>
            <br>
            <span>Cost: 100 points`},
            canAfford() {return player.points.gte(100) && !(player.u.upgrades.includes(15))},
            pay() {player.points = player.points.sub(100)},
            unlocked() {return player.t.challenges[11] > 2}
        },
        14: {
            fullDisplay() {return `
            <h3>Original?</h3><br>
            <span>Base point gain is always 1, but multiply point gain by upgrades^3</span><br>
            <span>Currently: x${tmp.u.upgrades[14].effect.round()}</span><br>
            <br>
            <span>Cost: 500 points`},
            effect() {return Decimal.pow(player.u.upgrades.length, 3).mul(player.u.upgrades.includes(31) + 1)},
            canAfford() {return player.points.gte(500) && !(player.u.upgrades.includes(15))},
            pay() {player.points = player.points.sub(500)},
            unlocked() {return player.t.challenges[11] > 3}
        },
        15: {
            fullDisplay() {return `
            <h3>Things are getting funky</h3><br>
            <span>Point gain is doubled but upgrades cannot be bought after buying this.</span><br>
            <span>Currently: x${tmp.u.upgrades[15].effect.round()}</span><br>
            <br>
            <span>Cost: 40,000 points`},
            effect() {return new Decimal(2).mul(player.u.upgrades.includes(31) + 1)},
            canAfford() {return player.points.gte(40000)},
            pay() {player.points = player.points.sub(40000)},
            unlocked() {return player.t.challenges[11] > 4}
        },
        21: {
            fullDisplay() {return `
            <h3>x2</h3><br>
            <span>Base point gain x2.</span><br>
            <span>Currently: x${tmp.u.upgrades[11].effect.round()}</span><br>
            <br>
            <span>Cost: 2e10 points`},
            effect() {return new Decimal(2)},
            canAfford() {return player.points.gte(2e10) && !(player.u.upgrades.includes(15))},
            pay() {player.points = player.points.sub(2e10)},
            unlocked() {return player.t.challenges[11] > 5}
        },
        31: {
            fullDisplay() {return `
            <h3>Hmm</h3><br>
            <span>Point gain is square rooted but every positive first row effect is doubled.</span><br>
            <br>
            <span>Cost: 80,000 points`},
            effect() {return new Decimal(2)},
            canAfford() {return player.points.gte(80000) && !(player.u.upgrades.includes(15))},
            pay() {player.points = player.points.sub(80000)},
            unlocked() {return player.t.challenges[12] > 1}
        }
    },
    tabFormat: [
        "upgrades"
    ]
})
addLayer("mu", {
    name: "metaupgrades",
    startData() {return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    row: "side",
    resource: "",
    layerShown() {return player.t.challenges[12] > 2},
    symbol: "MU",
    tooltip() {return "Meta Upgrades"},
    type: "none",

    upgrades: {
        rows: 1,
        cols: 1,
        11: {
            fullDisplay() {return `
            <h3>Four right angles</h3><br>
            <span>Point gain is squared.</span><br>
            <br>
            <span>Cost: 1e7 points`},
            canAfford() {return player.points.gte(1e7)},
            pay() {player.points = player.points.sub(1e7)},
            unlocked() {return player.t.challenges[12] > 2}
        }
    },
    tabFormat: [
        "upgrades"
    ]
})