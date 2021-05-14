addLayer("q", {
    name: "quarks",
    startData() {return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        spent: new Decimal(0)
    }},
    color: "#234567",
    row: 0,
    resource: "quarks",
    hotkeys: [
        {
            key: "q",
            description: "q: reset your points for quarks",
            onPress() { if (player.q.unlocked && canReset("q")) doReset("q") }
        },
        {
            key: "U",
            description: "shift+u: buys up quarks",
            onPress() { if (player.q.unlocked && tmp.q.buyables[11].canAfford) tmp.q.buyables[11].buy() }
        },
        {
            key: "D",
            description: "shift+d: buys down quarks",
            onPress() { if (player.q.unlocked && tmp.q.buyables[12].canAfford) tmp.q.buyables[12].buy() }
        }
    ],
    symbol: "Q",
    position: 0,
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1),
    exponent: function() {
        let exp = player.q.best.div(100).add(1)
        if (player.l.unlocked) {
            exp = exp.mul(tmp.l.effect[3])
        }
        if (player.q.upgrades.includes(53)) {
            exp = exp.mul(tmp.l.effect[6])
        }
        if (player.q.best.gte(1000)) {
            exp  = exp.mul(2)
        }
        if (player.q.best.gte(1100)) {
            exp  = exp.mul(player.q.best.div(1100))
        }
        if (player.q.best.gte(2000)) {
            exp  = exp.mul(player.q.best.div(1500))
        }
        if (player.q.best.gte(3000)) {
            exp  = exp.pow(player.q.best.div(3000))
        }
        return exp
    },
    base: 2,
    autoPrestige() {return player.q.upgrades.includes(31)},
    doReset(layer) {
        if (tmp[layer].row == 0) {return}
        if (layer === "a") { 
            if (!(player.a.milestones.includes("1"))) {
                player.q.upgrades = []
                if (player.a.milestones.includes("0")) {
                    player.q.upgrades = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25]
                }
            }
        }
        if (layer === "u") { 
            player.q.upgrades = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35]
            if (player.u.milestones.includes("2")) {
                player.q.upgrades.push(41, 42, 43, 44, 45)
            }
            if (player.u.milestones.includes("3")) {
                player.q.upgrades.push(51, 55)
            }
            if (player.u.milestones.includes("4")) {
                player.q.upgrades.push(52, 53, 54)
            }
        }
    },
    resetsNothing: function() {return player.a.milestones.includes("2")},
    buyables: {
        11: {
            title: "Up Quark",
            cost(x) {return new Decimal(1)},
            effect(x) {
                let gain = new Decimal(player.q.buyables[11])
                if (player.q.upgrades.includes(11)) {
                    gain = gain.mul(3)
                }
                if (player.l.unlocked) {
                    gain = gain.pow(tmp.l.effect[1])
                }
                if (player.q.upgrades.includes(54)) {
                    gain = gain.pow(tmp.l.effect[7])
                }
                return gain
            },
            display() {
                return `Increases point gain by 1.
                Cost: 1 quark
                Currently: ${tmp.q.buyables[11].effect.toPrecision(3)}
                Amount: ${player.q.buyables[11]}`
            },
            canAfford() {return player.q.points.sub(player.q.spent).gte(1) && player.q.buyables[11].lt(100)},
            buy() {
                player.q.spent = player.q.spent.add(1)
                player.q.buyables[11] = player.q.buyables[11].add(1)
            },
            sellOne() {
                if (player.q.buyables[11].gte(1)) {
                    player.q.spent = player.q.spent.sub(1)
                    player.q.buyables[11] = player.q.buyables[11].sub(1)
                }
            },
            sellAll() {
                player.q.spent = player.q.spent.sub(player.q.buyables[11])
                player.q.buyables[11] = new Decimal(0)
            }
        },
        12: {
            title: "Down Quark",
            cost(x) {return new Decimal(1)},
            effect(x) {
                let cap = new Decimal(100).mul(player.q.buyables[12])
                let gain = player.points.div(1000).mul(player.q.buyables[12]).sub(player.q.buyables[12])
                if (player.q.upgrades.includes(22) && gain.gte(cap) && cap.gte(1)) {
                    let logbase = 10
                    if (player.q.upgrades.includes(31)) {
                        logbase -= 8.75
                    }
                    if (player.q.upgrades.includes(32)) {
                        logbase -= 0.2
                    }
                    if (player.q.upgrades.includes(33)) {
                        logbase -= 0.04
                    }
                    if (player.a.unlocked) {
                        logbase -= tmp.a.effect
                    }
                    if (player.a.milestones.includes("0")) {
                        logbase **= 0.02
                    }
                    if (player.points.gte("1ee12")) {
                        logbase = 10
                    }
                    gain = gain.log(logbase).mul(cap)
                }
                else {
                    gain = gain.min(cap)
                }
                if (player.l.unlocked) {
                    gain = gain.mul(tmp.l.effect[2])
                }
                if (player.q.upgrades.includes(13)) {
                    gain = gain.mul(tmp.q.upgrades[13].effect)
                }
                return [gain, cap]
            },
            display() {
                return `Decrease point gain by 1, but gain 0.1% of points per second, up to ${tmp.q.buyables[12].effect[1]}.
                Cost: 1 quark
                Currently: ${tmp.q.buyables[12].effect[0].toPrecision(3)}
                Amount: ${player.q.buyables[12]}`
            },
            canAfford() {return player.q.points.sub(player.q.spent).gte(1) && player.q.buyables[12].lt(100)},
            buy() {
                player.q.spent = player.q.spent.add(1)
                player.q.buyables[12] = player.q.buyables[12].add(1)
            },
            sellOne() {
                if (player.q.buyables[12].gte(1)) {
                    player.q.spent = player.q.spent.sub(1)
                    player.q.buyables[12] = player.q.buyables[12].sub(1)
                }
            },
            sellAll() {
                player.q.spent = player.q.spent.sub(player.q.buyables[12])
                player.q.buyables[12] = new Decimal(0)
            }
        },
        13: {
            title: "Strange Quark",
            cost(x) {return new Decimal(2)},
            effect(x) {
                let pow = new Decimal(0.9).pow(player.q.buyables[13].sqrt())
                let mult = player.points.gte(10000) ? player.points.div(1000).log10().sqr().pow(player.q.buyables[13].gte(1) ? player.q.buyables[13].log10().add(1) : new Decimal(1)) : new Decimal(1)
                if (player.q.upgrades.includes(21)) {
                    pow = pow.sqr()
                    mult = mult.mul(69)
                }
                if (player.u.upgrades.includes(11)) {
                    pow = pow.tetrate(0.01)
                }
                if (player.u.upgrades.includes(12)) {
                    mult = mult.pow(new Decimal(1).div(pow.min(1)))
                }
                if (player.u.upgrades.includes(14)) {
                    pow = pow.sqrt()
                }
                return [pow, mult]
            },
            display() {
                return `Point gain ^${tmp.q.buyables[13].effect[0].toPrecision(3)}, but point gain ${tmp.q.buyables[13].effect[1].toPrecision(3)}x afterwards, based on points.
                Cost: 1 quark
                Amount: ${player.q.buyables[13]}`
            },
            unlocked() {return player.q.upgrades.includes(15)},
            canAfford() {return player.q.points.sub(player.q.spent).gte(1) && player.q.buyables[13].lt(1000)},
            buy() {
                player.q.spent = player.q.spent.add(1)
                player.q.buyables[13] = player.q.buyables[13].add(1)
            },
            sellOne() {
                if (player.q.buyables[13].gte(1)) {
                    player.q.spent = player.q.spent.sub(1)
                    player.q.buyables[13] = player.q.buyables[13].sub(1)
                }
            },
            sellAll() {
                player.q.spent = player.q.spent.sub(player.q.buyables[13])
                player.q.buyables[13] = new Decimal(0)
            }
        }
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Positivity</h3><br>
                Up quarks are 3x stronger.<br>
                Cost: 100 points`
            },
            canAfford() {return player.points.gte(100)},
            pay() {
                player.points = player.points.sub(100)
            }
        },
        12: {
            fullDisplay() {
                return `<h3>Totality</h3><br>
                Total quarks increase point gain.<br>
                Cost: 500 points<br>
                Currently: ${tmp.q.upgrades[12].effect.toPrecision(3)}x`
            },
            effect() {return player.q.points.sqrt()},
            unlocked() {return player.q.upgrades.includes(11)},
            canAfford() {return player.points.gte(500)},
            pay() {
                player.points = player.points.sub(500)
            }
        },
        13: {
            fullDisplay() {
                return `<h3>Negativity</h3><br>
                Up quarks boost down quarks.<br>
                Cost: 5,000 points<br>
                Currently: ${tmp.q.upgrades[13].effect.toPrecision(3)}x`
            },
            effect() {return player.q.buyables[11].add(1).sqrt()},
            unlocked() {return player.q.upgrades.includes(12)},
            canAfford() {return player.points.gte(5000)},
            pay() {
                player.points = player.points.sub(5000)
            }
        },
        14: {
            fullDisplay() {
                return `<h3>Balance</h3><br>
                Point gain ^1.25. Difference between up and down quarks weaken this boost.<br>
                Cost: 20,000 points<br>
                Currently: ^${tmp.q.upgrades[14].effect.toPrecision(3)}`
            },
            effect() {return new Decimal(1.25).pow(new Decimal(1).div(player.q.buyables[11].sub(player.q.buyables[12]).abs().add(1)).sqrt())},
            unlocked() {return player.q.upgrades.includes(13)},
            canAfford() {return player.points.gte(20000)},
            pay() {
                player.points = player.points.sub(20000)
            }
        },
        15: {
            fullDisplay() {
                return `<h3>Strange</h3><br>
                Unlock a new type of quark.<br>
                Cost: 1,000,000 points`
            },
            unlocked() {return player.q.upgrades.includes(14)},
            canAfford() {return player.points.gte(1000000)},
            pay() {
                player.points = player.points.sub(1000000)
            }
        },
        21: {
            fullDisplay() {
                return `<h3>Nice</h3><br>
                Strange quarks' positive effect is 69x stronger, but its negative effect is squared.<br>
                Cost: 3e7 points`
            },
            unlocked() {return player.q.upgrades.includes(15)},
            canAfford() {return player.points.gte(3e7)},
            pay() {
                player.points = player.points.sub(3e7)
            }
        },
        22: {
            fullDisplay() {
                return `<h3>Un(soft)capped</h3><br>
                The down quark cap is now a softcap.<br>
                Cost: 1e9 points`
            },
            unlocked() {return player.q.upgrades.includes(21)},
            canAfford() {return player.points.gte(1e9)},
            pay() {
                player.points = player.points.sub(1e9)
            }
        },
        23: {
            fullDisplay() {
                return `<h3>Power</h3><br>
                Point gain ^1.5.<br>
                Cost: 1e10 points`
            },
            unlocked() {return player.q.upgrades.includes(22)},
            canAfford() {return player.points.gte(1e10)},
            pay() {
                player.points = player.points.sub(1e10)
            }
        },
        24: {
            fullDisplay() {
                return `<h3>Almost there...</h3><br>
                Point gain ^1.5 again.<br>
                Cost: 1e13 points`
            },
            unlocked() {return player.q.upgrades.includes(23)},
            canAfford() {return player.points.gte(1e13)},
            pay() {
                player.points = player.points.sub(1e13)
            }
        },
        25: {
            fullDisplay() {
                return `<h3>Lairs and Leptons</h3><br>
                Unlocks leptons.<br>
                Cost: 1e18 points`
            },
            unlocked() {return player.q.upgrades.includes(24)},
            canAfford() {return player.points.gte(1e18)},
            pay() {
                player.points = player.points.sub(1e18)
            }
        },
        31: {
            fullDisplay() {
                return `<h3>Full Auto</h3><br>
                Quarks are automatically bought and down quark's softcap is weaker.<br>
                Cost: 1e36 points`
            },
            unlocked() {return player.l.points.gte(11)},
            canAfford() {return player.points.gte(1e36)},
            pay() {
                player.points = player.points.sub(1e36)
            }
        },
        32: {
            fullDisplay() {
                return `<h3>Unoriginal</h3><br>
                Down quark's softcap is weaker again.<br>
                Cost: 2.5e41 points`
            },
            unlocked() {return player.q.upgrades.includes(31)},
            canAfford() {return player.points.gte(2.5e41)},
            pay() {
                player.points = player.points.sub(2.5e41)
            }
        },
        33: {
            fullDisplay() {
                return `<h3>This is the final one i promise</h3><br>
                Down quark's softcap is weaker yet again.<br>
                Cost: 2.5e44 points`
            },
            unlocked() {return player.q.upgrades.includes(32)},
            canAfford() {return player.points.gte(2.5e44)},
            pay() {
                player.points = player.points.sub(2.5e44)
            }
        },
        34: {
            fullDisplay() {
                return `<h3>No more unoriginality</h3><br>
                The lepton effect is squared.<br>
                Cost: 1e48 points`
            },
            unlocked() {return player.q.upgrades.includes(33)},
            canAfford() {return player.points.gte(1e48)},
            pay() {
                player.points = player.points.sub(1e48)
            }
        },
        35: {
            fullDisplay() {
                return `<h3>I lied</h3><br>
                Unlocks atoms and point gain ^1.11.<br>
                Cost: 1e90 points`
            },
            unlocked() {return player.l.points.gte(20)},
            canAfford() {return player.points.gte(1e90)},
            pay() {
                player.points = player.points.sub(1e90)
            }
        },
        41: {
            fullDisplay() {
                return `<h3>Four right angles</h3><br>
                Point gain ^2.<br>
                Cost: e56,950 points`
            },
            unlocked() {return player.q.points.gte(953)},
            canAfford() {return player.points.gte("e56950")},
            pay() {
                player.points = player.points.sub("e56950")
            }
        },
        42: {
            fullDisplay() {
                return `<h3>Eight wrong angles</h3><br>
                Point gain ^3.<br>
                Cost: e171,882 points`
            },
            unlocked() {return player.q.upgrades.includes(41)},
            canAfford() {return player.points.gte("e171882")},
            pay() {
                player.points = player.points.sub("e171882")
            }
        },
        43: {
            fullDisplay() {
                return `<h3>This is even more unoriginal</h3><br>
                Point gain ^4.<br>
                Cost: e951,762 points`
            },
            unlocked() {return player.q.upgrades.includes(42)},
            canAfford() {return player.points.gte("e951762")},
            pay() {
                player.points = player.points.sub("e951762")
            }
        },
        44: {
            fullDisplay() {
                return `<h3>You can probably guess what this does</h3><br><br>
                Cost: e7,373,905 points`
            },
            unlocked() {return player.q.upgrades.includes(43)},
            canAfford() {return player.points.gte("e7373905")},
            pay() {
                player.points = player.points.sub("e7373905")
            }
        },
        45: {
            fullDisplay() {
                return `<h3>Muwuonic</h3><br>
                Unlocks muons.<br>
                Cost: e7,500,000 points`
            },
            unlocked() {return player.q.upgrades.includes(44)},
            canAfford() {return player.points.gte("e7500000")},
            pay() {
                player.points = player.points.sub("e7500000")
            }
        },
        51: {
            fullDisplay() {
                return `<h3>The unoriginality is back baby</h3><br>
                Point gain is increased based on points.<br>
                Cost: e185,534,014 points
                Currently: ^${tmp.q.upgrades[51].effect.toPrecision(3)}`
            },
            effect() {return player.points.add(10).slog().div(2).min(2)},
            unlocked() {return player.q.upgrades.includes(44)},
            canAfford() {return player.points.gte("e185534014")},
            pay() {
                player.points = player.points.sub("e185534014")
            }
        },
        52: {
            fullDisplay() {
                return `<h3>Wait a sec...</h3><br>
                Neutrality's first effect can go above one.<br>
                Req: 3,430 points per second in a Type-3 simulation`
            },
            unlocked() {return player.q.upgrades.includes(55)},
            canAfford() {return getPointGen().gte(3430) && player.l.activeChallenge === 13},
            pay() {
                return
            }
        },
        53: {
            fullDisplay() {
                return `<h3>Unoriginal joke about unoriginality</h3><br>
                Neutrality's second effect can go below one.<br>
                Req: 2,010 quarks`
            },
            unlocked() {return player.q.upgrades.includes(52)},
            canAfford() {return player.q.points.gte(2010)},
            pay() {
                return
            }
        },
        54: {
            fullDisplay() {
                return `<h3>The last unoriginal upgrade?</h3><br>
                Neutrality's third effect can go above one.<br>
                Req: 24,900 points per second in a Type-3 simulation`
            },
            unlocked() {return player.q.upgrades.includes(53)},
            canAfford() {return getPointGen().gte(24900) && player.l.activeChallenge === 13},
            pay() {
                return
            }
        },
        55: {
            fullDisplay() {
                return `<h3>Nooo, you can't just break the pattern of the unlocking upgrade being the fifth</h3><br>
                Unlocks neutral alignments<br>
                Cost: e9,104,627,203 points`
            },
            unlocked() {return player.l.challenges[13] === 1},
            canAfford() {return player.points.gte("e9104627203")},
            pay() {
                player.points = player.points.sub("e9104627203")
            }
        }
    },
    tabFormat: [
        [
            "display-text",
            function() {return `You have <h2 style='color: #234567; text-shadow: #234567 0px 0px 10px'>${player.q.points.sub(player.q.spent)}</h2> quarks`},
            {"font-size": "16px"}
        ],
        "prestige-button",
        "buyables",
        "upgrades"
    ]
})
addLayer("l", {
    name: "leptons",
    startData() {return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        resetTime: 0,
        law: new Decimal(0),
        chaos: new Decimal(0),
        good: new Decimal(0),
        evil: new Decimal(0),
        neutral: new Decimal(0),
        alignments: new Decimal(0),
        cap: new Decimal(1),
        comps: new Decimal(0)
    }},
    color: "#654321",
    row: 0,
    resource: "leptons",
    hotkeys: [
        {
            key: "l",
            description: "l: reset your points for leptons",
            onPress() { if (player.l.unlocked && canReset("l")) doReset("l") }
        },
        {
            key: "r",
            description: "r: respec lepton alignments",
            onPress() { if (player.l.unlocked) tmp.l.clickables.masterButtonPress() }
        }
    ],
    effect() {
        let strength = player.l.points.sqrt().add(2).log2().sqrt()
        if (player.q.upgrades.includes(34)) {
            strength = strength.sqr()
        }
        if (player.l.challenges[11] === 1) {
            strength = strength.mul(1.25)
        }
        if (player.l.activeChallenge === 11) {
            strength = strength.sqrt()
        }
        if (player.l.activeChallenge === 13) {
            strength = new Decimal(1)
        }
        let al1 = new Decimal(2).mul(player.l.law.gte(1) ? player.l.law : new Decimal(0.5)).pow(strength)
        let al2 = new Decimal(10).pow(player.l.chaos).pow(strength)
        let al3 = new Decimal(0.5).pow(player.l.good.sqrt()).pow(strength.sqrt())
        if (player.a.upgrades.includes(13)) {
            al3 = al3.div(tmp.a.upgrades[13].effect)
        }
        let al4 = new Decimal(1.25).mul(player.l.evil.gte(1) ? player.l.evil : new Decimal(0.8)).pow(strength)
        let al51 = new Decimal(1)
        if (player.q.upgrades.includes(52)) {
            al51 = new Decimal(1.25).pow(player.l.neutral).pow(strength)
            if (player.a.upgrades.includes(12)) {
                al51 = al51.sqr()
            }
        }
        let al52 = new Decimal(1)
        if (player.q.upgrades.includes(53)) {
            al52 = new Decimal(0.9).pow(player.l.neutral).pow(strength)
        }
        let al53 = new Decimal(1)
        if (player.q.upgrades.includes(54)) {
            al53 = new Decimal(2).pow(player.l.neutral).pow(strength)
        }
        return [strength, al1, al2, al3, al4, al51, al52, al53]
    },
    effectDescription: function() {return `which are boosting alignment boosts by ^${tmp.l.effect[0].toPrecision(3)}`},
    layerShown() {return player.q.upgrades.includes(25) || player.l.unlocked},
    symbol: "L",
    position: 1,
    branches: ["q"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1e18),
    exponent: function() {return player.l.best.div(100).add(1).sqr()},
    base: function() {return player.l.best.div(10).add(10)},
    autoPrestige() {return player.u.milestones.includes("5")},
    gainMult() {
        let mult = new Decimal(1)
        if (player.l.points.eq(118)) {
            mult = mult.div("e6990299")
        }
        return mult
    },
    doReset(layer) {
        if (tmp[layer].row == 0) {return}
        if (layer === "a") {
            if (!(player.a.milestones.includes("3"))) {
                player.l.points = new Decimal(0)
                player.l.best = new Decimal(0)
            }
        }
        if (layer === "u") { 
            player.l.points = new Decimal(100).add(player.u.points).min(200)
            player.l.best = new Decimal(100).add(player.u.points).min(200)
            if (!(player.u.milestones.includes("3"))) {
                tmp.l.clickables.masterButtonPress()
            }
        }
    },
    resetsNothing() {return player.u.milestones.includes("2")},
    alignmentCap() {
        let cap = 1
        if (player.a.milestones.includes("2")) {
            cap += 1
        }
        if (player.l.challenges[13] == 1) {
            cap += 1
        }
        player.l.cap = new Decimal(cap)
    },
    challengeCompletions() {
        let comps = 0
        for ([key, value] of Object.entries(player.l.challenges)) {
            comps += value
        }
        player.l.comps = new Decimal(comps)
    },
    clickables: {
        11: {
            title: "Lawful Good",
            display() {return `Currently: ${player.l.clickables[11] ? player.l.clickables[11] : "Inactive"}`},
            unlocked() {return player.l.unlocked},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[11] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.law = player.l.law.add(1)
                player.l.good = player.l.good.add(1)
                player.l.clickables[11] = "Active"
            }
        },
        12: {
            title: "Lawful Neutral",
            display() {return `Currently: ${player.l.clickables[12] ? player.l.clickables[12] : "Inactive"}`},
            unlocked() {return player.q.upgrades.includes(55)},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[12] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.law = player.l.law.add(1)
                player.l.neutral = player.l.neutral.add(1)
                player.l.clickables[12] = "Active"
            }
        },
        13: {
            title: "Lawful Evil",
            display() {return `Currently: ${player.l.clickables[13] ? player.l.clickables[13] : "Inactive"}`},
            unlocked() {return player.l.unlocked},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[13] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.law = player.l.law.add(1)
                player.l.evil = player.l.evil.add(1)
                player.l.clickables[13] = "Active"
            }
        },
        21: {
            title: "Neutral Good",
            display() {return `Currently: ${player.l.clickables[21] ? player.l.clickables[21] : "Inactive"}`},
            unlocked() {return player.q.upgrades.includes(55)},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[21] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.neutral = player.l.neutral.add(1)
                player.l.good = player.l.good.add(1)
                player.l.clickables[21] = "Active"
            }
        },
        22: {
            title: "True Neutral",
            display() {return `Currently: ${player.l.clickables[22] ? player.l.clickables[22] : "Inactive"}`},
            unlocked() {return player.q.upgrades.includes(55)},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[22] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.neutral = player.l.neutral.add(2)
                player.l.clickables[22] = "Active"
            }
        },
        23: {
            title: "Neutral Evil",
            display() {return `Currently: ${player.l.clickables[23] ? player.l.clickables[23] : "Inactive"}`},
            unlocked() {return player.q.upgrades.includes(55)},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[23] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.neutral = player.l.neutral.add(1)
                player.l.evil = player.l.evil.add(1)
                player.l.clickables[23] = "Active"
            }
        },
        31: {
            title: "Chaotic Good",
            display() {return `Currently: ${player.l.clickables[31] ? player.l.clickables[31] : "Inactive"}`},
            unlocked() {return player.l.unlocked},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[31] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.chaos = player.l.chaos.add(1)
                player.l.good = player.l.good.add(1)
                player.l.clickables[31] = "Active"
            }
        },
        32: {
            title: "Chaotic Neutral",
            display() {return `Currently: ${player.l.clickables[32] ? player.l.clickables[32] : "Inactive"}`},
            unlocked() {return player.q.upgrades.includes(55)},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[32] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.chaos = player.l.chaos.add(1)
                player.l.neutral = player.l.neutral.add(1)
                player.l.clickables[32] = "Active"
            }
        },
        33: {
            title: "Chaotic Evil",
            display() {return `Currently: ${player.l.clickables[33] ? player.l.clickables[33] : "Inactive"}`},
            unlocked() {return player.l.unlocked},
            canClick() {
                return player.l.alignments.lt(player.l.cap) && player.l.clickables[33] !== "Active"
            },
            onClick() {
                player.l.alignments = player.l.alignments.add(1)
                player.l.chaos = player.l.chaos.add(1)
                player.l.evil = player.l.evil.add(1)
                player.l.clickables[33] = "Active"
            }
        },
        masterButtonPress() {
            player.l.alignments = new Decimal(0)
            player.l.law = new Decimal(0)
            player.l.chaos = new Decimal(0)
            player.l.good = new Decimal(0)
            player.l.evil = new Decimal(0)
            player.l.neutral = new Decimal(0)
            player.l.clickables[11] = "Inactive"
            player.l.clickables[12] = "Inactive"
            player.l.clickables[13] = "Inactive"
            player.l.clickables[21] = "Inactive"
            player.l.clickables[22] = "Inactive"
            player.l.clickables[23] = "Inactive"
            player.l.clickables[31] = "Inactive"
            player.l.clickables[32] = "Inactive"
            player.l.clickables[33] = "Inactive"
        },
        masterButtonText: "Respec alignments",
        showMasterButton() {return player.l.unlocked}
    },
    challenges: {
        11: {
            name: "Type-1",
            challengeDescription: "The lepton effect is square rooted.",
            goalDescription: "983,000 points per second",
            canComplete() {return getPointGen().gte(983000)},
            rewardDescription: "The lepton effect is multiplied by 1.25.",
            unlocked() {return player.q.upgrades.includes(45)},
            onEnter() {
                player.points = new Decimal(0)
            }
        },
        12: {
            name: "Type-2",
            challengeDescription: "Point gain before simulation log ^^0.1",
            goalDescription: "500,000,000 points",
            canComplete() {return player.points.gte(500000000)},
            rewardDescription: "Base point gain x6.9e69",
            unlocked() {return player.l.challenges[11] === 1},
            onEnter() {
                player.points = new Decimal(0)
            }
        },
        13: {
            name: "Type-3",
            challengeDescription: "Lepton effect is always 1 and point gain after simulation log ^^0.5",
            goalDescription: "100,000 points",
            canComplete() {return player.points.gte(100000)},
            rewardDescription: "You can choose one more alignment",
            unlocked() {return player.l.challenges[12] === 1},
            onEnter() {
                player.points = new Decimal(0)
            }
        }
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                [
                    "display-text",
                    function() {
                        return `You have <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${player.l.law}</h2> law, which is raising up quark's effect to the <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${tmp.l.effect[1].toPrecision(3)}</h2>th power<br>
                        You have <h2 style='color: #000000; text-shadow: #ffffff 0px 0px 10px'>${player.l.chaos}</h2> chaos, which is multiplying down quark's effect by <h2 style='color: #000000; text-shadow: #ffffff 0px 0px 10px'>${tmp.l.effect[2].toPrecision(3)}</h2><br>
                        You have <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${player.l.good}</h2> good, which is multiplying quark requirement's second exponent by <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${tmp.l.effect[3].toPrecision(3)}</h2><br>
                        You have <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${player.l.evil}</h2> evil, which is raising point gain to the <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${tmp.l.effect[4].toPrecision(3)}</h2>th power<br>`
                    },
                    function() {return player.l.unlocked ? {} : {"display": "none"}}
                ],
                [
                    "display-text",
                    function() {
                        return `You have <h2 style='color: #654321; text-shadow: #654321 0px 0px 10px'>${player.l.neutral}</h2> neutrality, which is raising point gain to the <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${tmp.l.effect[5].toPrecision(3)}</h2>th power, 
                        multiplying quark requirement's second exponent by <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${tmp.l.effect[6].toPrecision(3)}</h2> and raising up quark's effect to the <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${tmp.l.effect[7].toPrecision(3)}</h2>th power<br>`
                    },
                    function() {return player.q.upgrades.includes(55) ? {} : {"display": "none"}}
                ],
                [
                    "display-text",
                    function() {
                        return `You can have ${player.l.cap} alignments at a time<br>`
                    },
                    function() {return player.l.unlocked ? {} : {"display": "none"}}
                ],
                "clickables"
            ]
        },
        "Muons": {
            content: [
                [
                    "display-text",
                    function() {
                        return `You have ${player.l.comps} completed particle simulations, boosting point gain by ^${new Decimal(1.01).pow(player.l.comps).toPrecision(3)}<br>
                        In simulations, point gain is equal to log10(base point gain)`
                    }
                ],
                "challenges"
            ],
            unlocked: false
        }
    },
    thisIsTheStupidestThingIveEverDoneInMyEntireLife() {
        tmp.l.tabFormat.Muons.unlocked = player.q.upgrades.includes(45)
        try {
            document.getElementById("neutral").style = player.q.upgrades.includes(55) ? {} : {"display": "none"}
        }
        catch {
            return
        }
    }
})
addLayer("a", {
    name: "atoms",
    startData() {return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0)
    }},
    color: "#420420",
    row: 1,
    resource: "atoms",
    hotkeys: [
        {
            key: "a",
            description: "a: reset your points for atoms",
            onPress() { if (player.a.unlocked && canReset("a")) doReset("a") }
        }
    ],
    effect() {
        let eff = new Decimal(0.01).sub(new Decimal(0.01).div(player.a.points.add(1).pow(player.a.points.add(1).mul(2))))
        if (eff.gte(0.009999)) {
            eff = new Decimal(0.009999)
        }
        return eff
    },
    effectDescription: function() {return `which are reducing down quarks' softcap's log base by ${tmp.a.effect.toPrecision(4)}`},
    layerShown() {return player.q.upgrades.includes(35) || player.a.unlocked},
    symbol: "A",
    position: 0,
    branches: ["q", "l"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1e100),
    exponent: function() {return player.a.best.div(100).add(1).cube()},
    base: function() {return player.a.best.add(100)},
    milestones: {
        0: {
            requirementDescription: "2 atoms",
            effectDescription: "Always have the first two rows of quark upgrades and down quarks' softcap's log base ^0.02.",
            done() {return player.a.best.gte(2)}
        },
        1: {
            requirementDescription: "5 atoms",
            effectDescription: "Always have all quark upgrades and point gain ^1.01 per atom.",
            done() {return player.a.best.gte(5)}
        },
        2: {
            requirementDescription: "7 atoms",
            effectDescription: "You can have two alignments at a time, quarks don't reset anything and point gain ^1.0001 per quark.",
            done() {return player.a.best.gte(7)}
        },
        3: {
            requirementDescription: "20 atoms",
            effectDescription: "Keep leptons on reset and point gain ^1.05 per lepton.",
            done() {return player.a.best.gte(20)}
        }
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Hightrogen</h3><br>
                Point gain ^1.01, increasing over time until ^2.00, reseting on lepton reset.<br>
                Req: 269,000,000 points per second in a Type-1 simulation<br>
                Currently: ^${tmp.a.upgrades[11].effect.toPrecision(3)}`
            },
            effect() {
                let eff = player.l.resetTime/100+1.01
                if (player.a.upgrades.includes(12)) {
                    eff += 0.24
                }
                if (player.a.upgrades.includes(13)) {
                    eff += 0.5
                }
                return new Decimal(eff).min(2)
            },
            unlocked() {return player.q.upgrades.includes(52)},
            canAfford() {return getPointGen().gte(269000000) && player.l.activeChallenge === 11},
            pay() {
                return
            }
        },
        12: {
            fullDisplay() {
                return `<h3>Lowtrogen</h3><br>
                Hightrogen effect starts at 1.25, and neutrality's first effect is squared.<br>
                Req: 575,000,000 points per second in a Type-1 simulation<br>`
            },
            unlocked() {return player.a.upgrades.includes(11)},
            canAfford() {return getPointGen().gte(575000000) && player.l.activeChallenge === 11},
            pay() {
                return
            }
        },
        13: {
            fullDisplay() {
                return `<h3>Nightrogen</h3><br>
                Hightrogen effect starts at 1.75, and chaos's effect boosts good's effect.<br>
                Req: 2e9 points per second in a Type-1 simulation<br>
                Currently: /${tmp.a.upgrades[13].effect.toPrecision(3)}`
            },
            effect() {return tmp.l.effect[2].pow(0.05)},
            unlocked() {return player.a.upgrades.includes(12)},
            canAfford() {return getPointGen().gte(2e9) && player.l.activeChallenge === 11},
            pay() {
                return
            }
        },
        14: {
            fullDisplay() {
                return `<h3>Daytrogen</h3><br>
                Point gain ^2<br>
                Req: 4.40e8.741e12 points per second<br>`
            },
            unlocked() {return player.a.upgrades.includes(13)},
            canAfford() {return getPointGen().gte("4.3e8740772133944")},
            pay() {
                return
            }
        },
        15: {
            fullDisplay() {
                return `<h3>Unoriginaltrogen</h3><br>
                Unlocks [something "unoriginal"] and point gain ^2<br>
                Req: 3,207 quarks<br>`
            },
            unlocked() {return player.a.upgrades.includes(14)},
            canAfford() {return player.q.points.gte(3207)},
            pay() {
                return
            }
        }
    }
})
addLayer("u", {
    name: "unoriginality",
    startData() {return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        exp: new Decimal(0)
    }},
    color: "#696969",
    row: 1,
    resource: function() {return `unoriginality^${player.u.unlocked ? player.u.exp.toPrecision(3) : 0}`},
    hotkeys: [
        {
            key: "u",
            description: "u: reset your points for unoriginality",
            onPress() { if (player.a.unlocked && canReset("u")) doReset("u") }
        }
    ],
    effect() {
        let eff0 = player.u.points.add(10).log10()
        let eff1 = new Decimal(1)
        if (player.u.exp.gte(1)) {
            eff1 = new Decimal(0.01).mul(player.u.points.add(2).log2()).mul(player.u.exp).add(1)
        }
        return [eff0, eff1]
    },
    effectDescription: function() {return `which is raising point gain to the ${tmp.u.effect[0].toPrecision(4)}th power`},
    layerShown() {return player.a.upgrades.includes(15) || player.u.unlocked},
    symbol: "U",
    position: 1,
    branches: ["q", "l"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal("ee20"),
    exponent: function() {return player.u.best.add(1)},
    base: function() {return new Decimal(10).pow(player.u.best.add(1))},
    unExp() {
        let exp = 0
        if (player.u.milestones.includes("1")) {
            exp += 1
        }
        player.u.exp = new Decimal(exp)
    },
    milestones: {
        0: {
            requirementDescription: "1 unoriginality",
            effectDescription: "You keep leptons equal to 100 plus your unoriginality, up to 200, and keep the first 3 rows of quark upgrades.",
            done() {return player.u.best.gte(1)}
        },
        1: {
            requirementDescription: "2 unoriginality",
            effectDescription: "Unoriginality exponent +1.",
            done() {return player.u.best.gte(2)},
            unlocked() {return player.u.milestones.includes("0")}
        },
        2: {
            requirementDescription: "3 unoriginality",
            effectDescription: "Keep the fourth row of upgrades, and leptons no longer reset anything.",
            done() {return player.u.best.gte(3)},
            unlocked() {return player.u.milestones.includes("1")}
        },
        3: {
            requirementDescription: "5 unoriginality",
            effectDescription: "Keep quark upgrades 51 and 55, and alignments are not reset.",
            done() {return player.u.best.gte(5)},
            unlocked() {return player.u.milestones.includes("2")}
        },
        4: {
            requirementDescription: "10 unoriginality",
            effectDescription: "Keep quark upgrades 52, 53 and 54.",
            done() {return player.u.best.gte(10)},
            unlocked() {return player.u.milestones.includes("3")}
        },
        5: {
            requirementDescription: "15 unoriginality",
            effectDescription: "Leptons are automatically bought, and point gain ^1.15",
            done() {return player.u.best.gte(15)},
            unlocked() {return player.u.milestones.includes("4")}
        },
        6: {
            requirementDescription: "16 unoriginality",
            effectDescription: "Unlock upgrades.",
            done() {return player.u.best.gte(16)},
            unlocked() {return player.u.milestones.includes("5")}
        }
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Stranger things</h3><br>
                Strange quarks's negative effect ^^0.01, and its positive effect has an exponential component.<br>
                Req: 267,000 points per second in a Type-3 simulation<br>`
            },
            unlocked() {return player.u.milestones.includes("6")},
            canAfford() {return getPointGen().gte(267000) && player.l.activeChallenge === 13},
            pay() {
                return
            }
        },
        12: {
            fullDisplay() {
                return `<h3>This upgrades is good i promise</h3><br>
                Strange quarks's negative effect boosts its positive effect.<br>
                Req: 300,000 points per second in a Type-3 simulation<br>`
            },
            unlocked() {return player.u.upgrades.includes(11)},
            canAfford() {return getPointGen().gte(300000) && player.l.activeChallenge === 13},
            pay() {
                return
            }
        },
        13: {
            fullDisplay() {
                return `<h3>Haha, wouldn't it be funny if unoriginality had an unoriginal upgrade?</h3><br>
                Point gain ^(0.99^-0.99).<br>
                Req: 3,254 quarks<br>`
            },
            unlocked() {return player.u.upgrades.includes(12)},
            canAfford() {return player.q.points.gte(3254)},
            pay() {
                return
            }
        },
        14: {
            fullDisplay() {
                return `<h3>[add witty upgrade name here]</h3><br>
                Strange quark's negative effect is square rooted.<br>
                Req: 305,000 points per second in a Type-3 simulation<br>`
            },
            unlocked() {return player.u.upgrades.includes(13)},
            canAfford() {return getPointGen().gte(305000) && player.l.activeChallenge === 13},
            pay() {
                return
            }
        },
        15: {
            fullDisplay() {
                return `<h3>Charm</h3><br>
                Unlocks [a cool thing that you can probably guess]<br>
                Req: e5.781e20 points per second<br>`
            },
            unlocked() {return player.u.upgrades.includes(14)},
            canAfford() {return getPointGen().gte("ee20.76203338319")},
            pay() {
                return
            }
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        [
            "display-text",
            function() {
                return `Unoriginality exponent effects:<br>
                <h3>Unoriginaltrogen</h3>'s second effect x${tmp.u.effect[1].toPrecision(4)}`
            },
            function() {return player.u.exp.gte(1) ? {} : {"display": "none"}}
        ],
        "milestones",
        "upgrades"
    ]
})