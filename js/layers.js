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
        },
        {
            key: "S",
            description: "shift+s: buys strange quarks",
            onPress() { if (player.q.unlocked && tmp.q.buyables[13].canAfford) tmp.q.buyables[13].buy() }
        }
    ],
    symbol: "Q",
    position: 0,
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1),
    exponent() {
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
    resetsNothing() {return player.a.milestones.includes("2")},
    buyables: {
        11: {
            title: "Up Quark",
            cost() {return new Decimal(1)},
            effect() {
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
                Currently: ${format(tmp.q.buyables[11].effect, 3)}
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
            cost() {return new Decimal(1)},
            effect() {
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
                return `Decrease point gain by 1 but gain 0.1% of points per second, up to ${tmp.q.buyables[12].effect[1]}.
                Cost: 1 quark
                Currently: ${format(tmp.q.buyables[12].effect[0], 2)}
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
            cost() {return new Decimal(2)},
            effect() {
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
                return `Point gain ^${format(tmp.q.buyables[13].effect[0], 2)} but point gain ${format(tmp.q.buyables[13].effect[1], 2)}x afterwards, based on points.
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
        },
        21: {
            title: "Charm Quark",
            cost() {return new Decimal(1000)},
            effect() {
                let exp = new Decimal(0.25).mul(player.q.buyables[21]).add(1).sqrt()
                return exp
            },
            display() {
                return `Unoriginality exponent +${format(tmp.q.buyables[21].effect, 2)}.
                Cost: 1000 quark
                Amount: ${player.q.buyables[21]}`
            },
            unlocked() {return player.u.upgrades.includes(15)},
            canAfford() {return player.q.points.sub(player.q.spent).gte(1000) && player.q.buyables[21].lt(100)},
            buy() {
                player.q.spent = player.q.spent.add(1000)
                player.q.buyables[21] = player.q.buyables[21].add(1)
            },
            sellOne() {
                if (player.q.buyables[21].gte(1)) {
                    player.q.spent = player.q.spent.sub(1000)
                    player.q.buyables[21] = player.q.buyables[21].sub(1)
                }
            },
            sellAll() {
                player.q.spent = player.q.spent.sub(player.q.buyables[21]*1000)
                player.q.buyables[21] = new Decimal(0)
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
                Currently: ${format(tmp.q.upgrades[12].effect, 2)}x`
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
                Currently: ${format(tmp.q.upgrades[13].effect, 2)}x`
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
                Point gain ^1.25. The difference between up and down quarks weakens this boost.<br>
                Cost: 20,000 points<br>
                Currently: ^${format(tmp.q.upgrades[14].effect, 2)}`
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
                Strange quark's positive effect is 69x stronger but its negative effect is squared.<br>
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
                The down quark cap is now a softcap. (log<sub>base</sub>points, starting base = 10)<br>
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
                Unlock leptons.<br>
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
                Quarks are automatically bought and down quark's softcap is weaker. (log base -8.75)<br>
                Cost: 1e36 points`
            },
            unlocked() {return player.q.upgrades.includes(25)},
            canAfford() {return player.points.gte(1e36)},
            pay() {
                player.points = player.points.sub(1e36)
            }
        },
        32: {
            fullDisplay() {
                return `<h3>Unoriginal</h3><br>
                Down quark's softcap is weaker again. (log base -0.2)<br>
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
                Down quark's softcap is weaker yet again. (log base -0.04)<br>
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
                Lepton's effect is squared.<br>
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
                Unlock atoms and point gain ^1.11.<br>
                Cost: 1e90 points`
            },
            unlocked() {return player.q.upgrades.includes(34)},
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
            unlocked() {return player.q.upgrades.includes(35)},
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
                Point gain ^${format(tmp.q.upgrades[43].effect, 3)}.<br>
                Cost: e951,762 points`
            },
            effect() {
                let eff = new Decimal(4).mul(tmp.u.effect[2])
                return eff
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
                Unlock muons.<br>
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
                Cost: e185,534,014 points<br>
                Currently: ^${format(tmp.q.upgrades[51].effect, 2)}`
            },
            effect() {return player.points.add(10).slog().div(2).min(2)},
            unlocked() {return player.q.upgrades.includes(45)},
            canAfford() {return player.points.gte("e185534014")},
            pay() {
                player.points = player.points.sub("e185534014")
            }
        },
        52: {
            fullDisplay() {
                return `<h3>Wait a sec...</h3><br>
                Neutrality's first effect can go above one.<br>
                Req: 4,050 points per second in a Type-3 simulation`
            },
            unlocked() {return player.q.upgrades.includes(55)},
            canAfford() {return getPointGen().gte(4050) && player.l.activeChallenge === 13},
            pay() {return}
        },
        53: {
            fullDisplay() {
                return `<h3>Unoriginal joke about unoriginality</h3><br>
                Neutrality's second effect can go below one.<br>
                Req: 2,010 quarks`
            },
            unlocked() {return player.q.upgrades.includes(52)},
            canAfford() {return player.q.points.gte(2010)},
            pay() {return}
        },
        54: {
            fullDisplay() {
                return `<h3>The last unoriginal upgrade?</h3><br>
                Neutrality's third effect can go above one.<br>
                Req: 25,000 points per second in a Type-3 simulation`
            },
            unlocked() {return player.q.upgrades.includes(53)},
            canAfford() {return getPointGen().gte(25000) && player.l.activeChallenge === 13},
            pay() {return}
        },
        55: {
            fullDisplay() {
                return `<h3>Nooo, you can't just break the pattern of the unlocking upgrade being the fifth</h3><br>
                Unlock neutral alignments.<br>
                Cost: e9,104,627,203 points`
            },
            unlocked() {return player.q.upgrades.includes(51)},
            canAfford() {return player.points.gte("e9104627203")},
            pay() {
                player.points = player.points.sub("e9104627203")
            }
        },
        61: {
            fullDisplay() {
                return `<h3>That's it?</h3><br>
                Unlock a new type of particle simulation and unoriginality exponent +0.5.<br>
                Req: 4,297 quarks`
            },
            unlocked() {return player.u.upgrades.includes(15)},
            canAfford() {return player.q.points.gte(4297)},
            pay() {return}
        },
        62: {
            fullDisplay() {
                return `<h3>Good feature coming in 3...</h3><br>
                Unoriginality exponent is multiplied by pi.<br>
                Req: 1,380,000 points per second in a Type-3 simulation`
            },
            unlocked() {return player.q.upgrades.includes(61)},
            canAfford() {return getPointGen().gte(1380000) && player.l.activeChallenge === 13},
            pay() {return}
        },
        63: {
            fullDisplay() {
                return `<h3>2...</h3><br>
                Unoriginality exponent +0.35.<br>
                Req: 1,537,500 points per second in a Type-3 simulation`
            },
            unlocked() {return player.q.upgrades.includes(62)},
            canAfford() {return getPointGen().gte(1537500) && player.l.activeChallenge === 13},
            pay() {return}
        },
        64: {
            fullDisplay() {
                return `<h3>1...</h3><br>
                Unoriginality exponent +0.01 after multiplier.<br>
                Req: e5.166e25 points`
            },
            unlocked() {return player.q.upgrades.includes(63)},
            canAfford() {return player.points.gte("ee25.71317653")},
            pay() {return}
        },
        65: {
            fullDisplay() {
                return `<h3>2 in 1 bundle</h3><br>
                Unlock tau particles and electrons. <div style='font-size:7px'>(Electrons not included)</div><br>
                Req: 10,000 points per second in a Type-4 simulation`
            },
            unlocked() {return player.q.upgrades.includes(64)},
            canAfford() {return getPointGen().gte(10000) && player.l.activeChallenge === 21},
            pay() {return}
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
        tau: new Decimal(0),
        tauprod: new Decimal(0),
        taueff: new Decimal(1),
        taugain: new Decimal(0),
        progbar1: new Decimal(0),
        progbar2: 0,
        min: new Decimal(0.45),
        max: new Decimal(0.55),
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
        if (player.l.activeChallenge === 21) {
            al51 = new Decimal(1)
            al52 = new Decimal(1)
            al53 = new Decimal(1)
        }
        return [strength, al1, al2, al3, al4, al51, al52, al53]
    },
    effectDescription() {return `which are boosting alignment boosts by ^${format(tmp.l.effect[0], 2)}`},
    layerShown() {return player.q.upgrades.includes(25) || player.l.unlocked},
    symbol: "L",
    position: 1,
    branches: ["q"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1e18),
    exponent() {return player.l.best.div(100).add(1).sqr()},
    base() {return player.l.best.div(10).add(10)},
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
        if (player.u.upgrades.includes(15)) {
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
    update(diff) {
        // tau stuff
        let gain = player.l.tau.add(10).log10()
        if (player.l.upgrades.includes(13)) {
            gain = gain.mul((Math.sin(player.l.progbar2)+1)*5)
        }
        if (player.l.buyables[12].gte(1)) {
            gain = gain.pow(tmp.l.buyables[12].effect)
        }
        if (player.l.buyables[11].gte(1)) {
            gain = gain.mul(tmp.l.buyables[11].effect)
        }
        if (player.l.buyables[13].gte(1)) {
            gain = gain.pow(tmp.l.buyables[13].effect)
        }
        if (player.l.upgrades.includes(14)) {
            gain = gain.pow(1.5)
        }
        if (player.l.upgrades.includes(21)) {
            gain = gain.pow(tmp.l.upgrades[21].effect)
        }
        if (player.l.upgrades.includes(22)) {
            gain = gain.pow(tmp.l.upgrades[22].effect)
        }
        if (player.l.upgrades.includes(23)) {
            gain = gain.pow((Math.sin(player.l.progbar2)+1)*5)
        }
        if (player.l.upgrades.includes(24)) {
            gain = gain.sqr()
        }
        if (tmp.e.effect.gte(1)) {
            gain = gain.pow(tmp.e.effect)
        }
        if (player.e.upgrades.includes(14)) {
            gain = gain.pow(tmp.e.upgrades[14].effect)
        }
        if (player.l.upgrades.includes(11) && player.l.progbar1.gte(player.l.min) && player.l.progbar1.lte(player.l.max)) {
            gain = gain.sqr()
        }
        if (player.q.upgrades.includes(65)) {
            player.l.tau = player.l.tau.add(gain.mul(diff))
            player.l.tauprod = gain
        }
        if (player.l.upgrades.includes(12)) {
            player.l.min = new Decimal(0.4)
            player.l.max = new Decimal(0.6)
        }
        if (player.l.upgrades.includes(11) && player.l.progbar1.gte(0)) {
            player.l.progbar1 = player.l.progbar1.sub(diff*0.25)
            if (player.l.progbar1.lt(0)) {
                player.l.progbar1 = new Decimal(0)
            }
        }
        if (player.l.upgrades.includes(13)) {
            let mult = 0.5
            if (player.e.upgrades.includes(12)) {
                mult *= 2
            }
            player.l.progbar2 += diff * mult
        }
        if (player.l.upgrades.includes(15)) {
            let gain = new Decimal(1e24).mul(player.l.tau.add(10).log10())
            if (player.e.upgrades.includes(62)) {
                gain = gain.mul(tmp.e.upgrades[62].effect)
            }
            player.l.taueff = player.l.taueff.add(gain.mul(diff))
            player.l.taugain = gain
        }
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
            challengeDescription: "Lepton's effect is square rooted.",
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
            challengeDescription: "Lepton's effect is always 1 and point gain after simulation log ^^0.5",
            goalDescription: "100,000 points",
            canComplete() {return player.points.gte(100000)},
            rewardDescription: "You can choose one more alignment",
            unlocked() {return player.l.challenges[12] === 1},
            onEnter() {
                player.points = new Decimal(0)
            }
        },
        21: {
            name: "Type-4",
            challengeDescription: "Neutrality does nothing and point gain after simulation log ^^0.25.",
            goalDescription: "5,400 points per second",
            canComplete() {return getPointGen().gte(5400)},
            rewardDescription: "Point gain ^lepton effect",
            unlocked() {return player.q.upgrades.includes(61)},
            onEnter() {
                player.points = new Decimal(0)
            }
        }
    },
    buyables: {
        11: {
            title: "Generic buyable that boosts gain",
            cost() {return new Decimal(1.25).pow(new Decimal(1.25).pow(player.l.buyables[11]))},
            effect() {
                let mult = new Decimal(1.5).pow(player.l.buyables[11])
                return mult
            },
            display() {
                return `Multiplies tau gain by 1.5 per buyable.
                Cost: ${format(tmp.l.buyables[11].cost, 2)}
                Currently: x${format(tmp.l.buyables[11].effect, 2)}
                Amount: ${player.l.buyables[11]}`
            },
            canAfford() {return player.l.tau.gte(tmp.l.buyables[11].cost)},
            buy() {
                player.l.tau = player.l.tau.sub(tmp.l.buyables[11].cost)
                player.l.buyables[11] = player.l.buyables[11].add(1)
            }
        },
        12: {
            title: "This one raises things to a power",
            cost() {return new Decimal(10).pow(new Decimal(10).pow(player.l.buyables[12].sqr()))},
            effect() {
                let mult = new Decimal(2).pow(player.l.buyables[12])
                return mult
            },
            display() {
                return `Base tau gain ^2 per buyable.
                Cost: ${format(tmp.l.buyables[12].cost, 2)}
                Currently: ^${format(tmp.l.buyables[12].effect, 2)}
                Amount: ${player.l.buyables[12]}`
            },
            canAfford() {return player.l.tau.gte(tmp.l.buyables[12].cost)},
            buy() {
                player.l.tau = player.l.tau.sub(tmp.l.buyables[12].cost)
                player.l.buyables[12] = player.l.buyables[12].add(1)
            }
        },
        13: {
            title: "This one raises all gain to a power",
            cost() {return new Decimal(1e20).pow(new Decimal(1.1).pow(player.l.buyables[13].sqr()))},
            effect() {
                let mult = new Decimal(1.1).pow(player.l.buyables[13])
                return mult
            },
            display() {
                return `Tau gain ^1.1 per buyable.
                Cost: ${format(tmp.l.buyables[13].cost, 2)}
                Currently: ^${format(tmp.l.buyables[13].effect, 2)}
                Amount: ${player.l.buyables[13]}`
            },
            unlocked() {return player.l.upgrades.includes(12)},
            canAfford() {return player.l.tau.gte(tmp.l.buyables[13].cost)},
            buy() {
                player.l.tau = player.l.tau.sub(tmp.l.buyables[13].cost)
                player.l.buyables[13] = player.l.buyables[13].add(1)
            }
        },
        101: {
            title: "Generic Button #0",
            cost() {return new Decimal(0)},
            display() {
                return `This button does stuff to the bars below. Read those for actual information. (Hold down the button for at least 0.25s for stuff to happen)`
            },
            unlocked() {return player.l.upgrades.includes(11)},
            canAfford() {return true},
            buy() {
                if (player.l.progbar1.lt(1)) {
                    player.l.progbar1 = player.l.progbar1.add(0.025)
                    if (player.l.progbar1.gt(1)) {
                        player.l.progbar1 = new Decimal(1)
                    }
                }
                if (player.l.upgrades.includes(13)) {
                    player.l.progbar2 -= 0.0175
                }
            },
            style: {"height": "125px", "width": "125px"}
        }
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>no more capitalized upgrades</h3><br>
                Unlock a button.<br>
                Cost: 10,000,000 tau particles`
            },
            canAfford() {return player.l.tau.gte(10000000)},
            pay() {
                player.l.tau = player.l.tau.sub(10000000)
            }
        },
        12: {
            fullDisplay() {
                return `<h3>I lied</h3><br>
                The bar has a wider range and unlock a buyable.<br>
                Cost: 1e20 tau particles`
            },
            unlocked() {return player.l.upgrades.includes(11)},
            canAfford() {return player.l.tau.gte(1e20)},
            pay() {
                player.l.tau = player.l.tau.sub(1e20)
            }
        },
        13: {
            fullDisplay() {
                return `<h3>Gee tau how come micro lets this tab have two bars</h3><br>
                Unlock another bar.<br>
                Cost: 1e26 tau particles`
            },
            unlocked() {return player.l.upgrades.includes(12)},
            canAfford() {return player.l.tau.gte(1e26)},
            pay() {
                player.l.tau = player.l.tau.sub(1e26)
            }
        },
        14: {
            fullDisplay() {
                return `<h3>Look i genuinely dont know what to name these anymore</h3><br>
                Tau gain ^1.5.<br>
                Cost: 1e42 tau particles`
            },
            unlocked() {return player.l.upgrades.includes(13)},
            canAfford() {return player.l.tau.gte(1e42)},
            pay() {
                player.l.tau = player.l.tau.sub(1e42)
            }
        },
        15: {
            fullDisplay() {
                return `<h3>We do a little grinding</h3><br>
                Unlock the tau effect.<br>
                Cost: 1e75 tau particles`
            },
            unlocked() {return player.l.upgrades.includes(14)},
            canAfford() {return player.l.tau.gte(1e75)},
            pay() {
                player.l.tau = player.l.tau.sub(1e75)
            }
        },
        21: {
            fullDisplay() {
                return `<h3>Synergism</h3><br>
                Points boost tau gain.<br>
                Req: ee28 points<br>
                Currently: ^${format(tmp.l.upgrades[21].effect, 2)}`
            },
            effect() {return player.points.add(10).slog().min(4)},
            unlocked() {return player.l.upgrades.includes(15)},
            canAfford() {return player.points.gte("ee28")},
            pay() {return}
        },
        22: {
            fullDisplay() {
                return `<h3>Narcissism</h3><br>
                Tau boost tau gain.<br>
                Req: 2.5e348 tau particles<br>
                Currently: ^${format(tmp.l.upgrades[22].effect, 2)}`
            },
            effect() {return player.l.tau.add(10).log10().add(9).log(10)},
            unlocked() {return player.l.upgrades.includes(21)},
            canAfford() {return player.l.tau.gte("2.5e348")},
            pay() {return}
        },
        23: {
            fullDisplay() {
                return `<h3>E</h3><br>
                Second bar's effect is exponential as well.<br>
                Req: 1e1411 tau particles`
            },
            unlocked() {return player.l.upgrades.includes(22)},
            canAfford() {return player.l.tau.gte("1e1411")},
            pay() {return}
        },
        24: {
            fullDisplay() {
                return `<h3>aeiou</h3><br>
                Tau gain ^2.<br>
                Req: ee31 points`
            },
            unlocked() {return player.l.upgrades.includes(23)},
            canAfford() {return player.points.gte("ee31")},
            pay() {return}
        },
        25: {
            fullDisplay() {
                return `<h3>(Electrons included)</h3><br>
                Unlock electrons.<br>
                Req: e156,600 tau particles`
            },
            unlocked() {return player.l.upgrades.includes(24)},
            canAfford() {return player.l.tau.gte("e156600")},
            pay() {return}
        }
    },
    bars: {
        one: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() {return player.l.progbar1},
            display() {
                return `Currently: ${format(player.l.progbar1.mul(100), 2)}%`
            },
            fillStyle() {return player.l.progbar1.gte(player.l.min) && player.l.progbar1.lte(player.l.max) ? {"background-color": "#77bf5f", "transition-duration": "0.25s"} : {"background-color": "#ffffff", "transition-duration": "0.25s"}},
            textStyle: {"color": "#888888"},
            unlocked() {return player.l.upgrades.includes(11)}
        },
        two: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() {return (Math.sin(player.l.progbar2)+1)/2},
            display() {
                return `Currently: ${format((Math.sin(player.l.progbar2)+1)*5, 2)}x`
            },
            textStyle: {"color": "#888888"},
            unlocked() {return player.l.upgrades.includes(13)}
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
                        let str = `You have <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${player.l.law}</h2> law, which is raising up quark's effect to the <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${format(tmp.l.effect[1], 2)}</h2>th power<br>
                        You have <h2 style='color: #000000; text-shadow: #ffffff 0px 0px 10px'>${player.l.chaos}</h2> chaos, which is multiplying down quark's effect by <h2 style='color: #000000; text-shadow: #ffffff 0px 0px 10px'>${format(tmp.l.effect[2], 2)}</h2><br>
                        You have <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${player.l.good}</h2> good, which is multiplying quark requirement's second exponent by <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${format(tmp.l.effect[3], 2)}</h2><br>
                        You have <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${player.l.evil}</h2> evil, which is raising point gain to the <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${format(tmp.l.effect[4], 2)}</h2>th power<br>`
                        if (player.q.upgrades.includes(55)) {
                            str += `You have <h2 style='color: #654321; text-shadow: #654321 0px 0px 10px'>${player.l.neutral}</h2> neutrality, which is raising point gain to the <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${format(tmp.l.effect[5], 2)}</h2>th power, 
                            multiplying quark requirement's second exponent by <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${format(tmp.l.effect[6], 2)}</h2> and raising up quark's effect to the <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${format(tmp.l.effect[7], 2)}</h2>th power<br>`
                        }
                        str += `You can have ${player.l.cap} alignments at a time`
                        if (player.l.unlocked) {return str}
                    }
                ],
                "clickables"
            ]
        },
        "Muons": {
            content: [
                [
                    "display-text",
                    function() {
                        return `You have ${player.l.comps} completed particle simulations, boosting point gain by ^${format(new Decimal(1.01).pow(player.l.comps), 2)}<br>
                        In simulations, point gain is equal to log10(base point gain)`
                    }
                ],
                "challenges"
            ],
            unlocked() {return player.q.upgrades.includes(45)}
        },
        "Tau": {
            content: [
                [
                    "display-text",
                    function() {
                        return `You have ${format(player.l.tau, 3)} tau particles<br>
                        You are gaining ${format(player.l.tauprod, 3)} tau particles per second`
                    }
                ],
                [
                    "display-text",
                    function() {
                        if (player.l.upgrades.includes(15)) {
                            return `Your tau particles are multiplying point gain after all powers by e${format(player.l.taueff, 2)}<br>
                            Your tau multiplier exponent is increasing by ${format(player.l.taugain, 2)} per second`
                        }
                    }
                ],
                "blank",
                "buyables",
                "blank",
                [
                    "display-text",
                    function() {
                        if (player.l.upgrades.includes(11)) {
                            return `You need to have the bar between ${format(player.l.min.mul(100), 2)}% and ${format(player.l.max.mul(100), 2)}% to square tau gain.
                            Currently: ${player.l.progbar1.gte(player.l.min) && player.l.progbar1.lte(player.l.max) ? "Active" : "Inactive"}`
                        }
                    }
                ],
                ["bar", "one"],
                [
                    "display-text",
                    function() {
                        if (player.l.upgrades.includes(13)) {
                            return `The bar fluctuates between 0x and 10x to base tau gain. Holding the button down will slow down the fluctuation.`
                        }
                    }
                ],
                ["bar", "two"],
                "upgrades"
            ],
            unlocked() {return player.q.upgrades.includes(65)}
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
    effectDescription() {return `which are reducing down quarks' softcap's log base by ${tmp.a.effect.toPrecision(4)}`},
    layerShown() {return player.q.upgrades.includes(35) || player.a.unlocked},
    symbol: "A",
    position: 0,
    branches: ["q", "l"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1e100),
    exponent() {return player.a.best.div(100).add(1).cube()},
    base() {return player.a.best.add(100)},
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
                Currently: ^${format(tmp.a.upgrades[11].effect, 2)}`
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
            pay() {return}
        },
        12: {
            fullDisplay() {
                return `<h3>Lowtrogen</h3><br>
                Hightrogen's effect starts at 1.25 and neutrality's first effect is squared.<br>
                Req: 575,000,000 points per second in a Type-1 simulation`
            },
            unlocked() {return player.a.upgrades.includes(11)},
            canAfford() {return getPointGen().gte(575000000) && player.l.activeChallenge === 11},
            pay() {return}
        },
        13: {
            fullDisplay() {
                return `<h3>Nightrogen</h3><br>
                Hightrogen's effect starts at 1.75 and chaos's effect boosts good's effect.<br>
                Req: 3e9 points per second in a Type-1 simulation<br>
                Currently: /${format(tmp.a.upgrades[13].effect, 2)}`
            },
            effect() {return tmp.l.effect[2].pow(0.05)},
            unlocked() {return player.a.upgrades.includes(12)},
            canAfford() {return getPointGen().gte(3e9) && player.l.activeChallenge === 11},
            pay() {return}
        },
        14: {
            fullDisplay() {
                return `<h3>Daytrogen</h3><br>
                Point gain ^2.<br>
                Req: 4.40e8.741e12 points per second`
            },
            unlocked() {return player.a.upgrades.includes(13)},
            canAfford() {return getPointGen().gte("4.3e8740772133944")},
            pay() {return}
        },
        15: {
            fullDisplay() {
                return `<h3>Unoriginaltrogen</h3><br>
                Unlocks unoriginality and point gain ^${format(tmp.a.upgrades[15].effect, 4)}.<br>
                Req: 3,207 quarks`
            },
            effect() {
                let eff = new Decimal(2).mul(tmp.u.effect[1])
                return eff
            },
            unlocked() {return player.a.upgrades.includes(14)},
            canAfford() {return player.q.points.gte(3207)},
            pay() {return}
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
    resource() {return `unoriginality^${player.u.unlocked ? format(player.u.exp, 2) : 0}`},
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
        let eff2 = new Decimal(1)
        if (player.u.exp.gte(10)) {
            eff2 = new Decimal(0.01).mul(player.u.points.add(2).log10()).mul(player.u.exp).add(1)
        }
        return [eff0, eff1, eff2]
    },
    effectDescription() {return `which is raising point gain to the ${format(tmp.u.effect[0], 4)}th power`},
    layerShown() {return player.a.upgrades.includes(15) || player.u.unlocked},
    symbol: "U",
    position: 1,
    branches: ["q", "l"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal("ee20"),
    exponent() {return player.u.best.add(1)},
    base() {return new Decimal(10).pow(player.u.best.add(1))},
    resetsNothing() {return player.u.milestones.includes("7")},
    unExp() {
        let exp = new Decimal(0)
        if (player.u.milestones.includes("1")) {
            exp = exp.add(1)
        }
        if (player.q.buyables[21].gte(1)) {
            exp = exp.add(tmp.q.buyables[21].effect)
        }
        if (player.q.upgrades.includes(61)) {
            exp = exp.add(0.5)
        }
        if (player.q.upgrades.includes(63)) {
            exp = exp.add(0.36)
        }
        if (player.q.upgrades.includes(62)) {
            exp = exp.mul(3.14)
        }
        if (player.q.upgrades.includes(64)) {
            exp = exp.add(0.01)
        }
        player.u.exp = exp
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
            effectDescription: "Keep the fourth row of quark upgrades and leptons no longer reset anything.",
            done() {return player.u.best.gte(3)},
            unlocked() {return player.u.milestones.includes("1")}
        },
        3: {
            requirementDescription: "5 unoriginality",
            effectDescription: "Keep the 21st and 25th quark upgrades and alignments are not reset.",
            done() {return player.u.best.gte(5)},
            unlocked() {return player.u.milestones.includes("2")}
        },
        4: {
            requirementDescription: "10 unoriginality",
            effectDescription: "Keep the fifth row of quark upgrades.",
            done() {return player.u.best.gte(10)},
            unlocked() {return player.u.milestones.includes("3")}
        },
        5: {
            requirementDescription: "15 unoriginality",
            effectDescription: "Leptons are automatically bought and point gain ^1.15",
            done() {return player.u.best.gte(15)},
            unlocked() {return player.u.milestones.includes("4")}
        },
        6: {
            requirementDescription: "16 unoriginality",
            effectDescription: "Unlock upgrades.",
            done() {return player.u.best.gte(16)},
            unlocked() {return player.u.milestones.includes("5")}
        },
        7: {
            requirementDescription: "18 unoriginality",
            effectDescription: "Unoriginality no longer resets anything.",
            done() {return player.u.best.gte(18)},
            unlocked() {return player.u.milestones.includes("6")}
        }
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Stranger things</h3><br>
                Strange quarks's negative effect ^^0.01 and point gain ^log10(log10(positive effect)).<br>
                Req: 269,000 points per second in a Type-3 simulation`
            },
            unlocked() {return player.u.milestones.includes("6")},
            canAfford() {return getPointGen().gte(269000) && player.l.activeChallenge === 13},
            pay() {return}
        },
        12: {
            fullDisplay() {
                return `<h3>This upgrades is good i promise</h3><br>
                Strange quarks's negative effect boosts its positive effect.<br>
                Req: 300,000 points per second in a Type-3 simulation`
            },
            unlocked() {return player.u.upgrades.includes(11)},
            canAfford() {return getPointGen().gte(300000) && player.l.activeChallenge === 13},
            pay() {return}
        },
        13: {
            fullDisplay() {
                return `<h3>Haha, wouldn't it be funny if unoriginality had an unoriginal upgrade?</h3><br>
                Point gain ^(0.99^-0.99).<br>
                Req: e5.166e20 points`
            },
            unlocked() {return player.u.upgrades.includes(12)},
            canAfford() {return player.points.gte("ee20.71313578")},
            pay() {return}
        },
        14: {
            fullDisplay() {
                return `<h3>[add witty upgrade name here]</h3><br>
                Strange quark's negative effect is square rooted.<br>
                Req: 305,000 points per second in a Type-3 simulation`
            },
            unlocked() {return player.u.upgrades.includes(13)},
            canAfford() {return getPointGen().gte(305000) && player.l.activeChallenge === 13},
            pay() {return}
        },
        15: {
            fullDisplay() {
                return `<h3>9 Charm 4</h3><br>
                Unlocks charm quarks and you can choose one more alignment.<br>
                Req: e5.781e20 points per second<br>
                Currently: ^${format(tmp.q.upgrades[51].effect, 2)}`
            },
            unlocked() {return player.u.upgrades.includes(14)},
            canAfford() {return getPointGen().gte("ee20.76203338319")},
            pay() {return}
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        [
            "display-text",
            function() {
                let str = `Unoriginality exponent effects:<br>
                <h3>Unoriginaltrogen</h3>'s second effect x${format(tmp.u.effect[1], 4)}<br>`
                if (player.u.exp.gte(10)) {
                    str += `<h3>This is even more unoriginal</h3>'s effect x${format(tmp.u.effect[2], 4)}<br>`
                }
                if (player.u.exp.gte(1)) {return str}
            }
        ],
        "milestones",
        "upgrades"
    ]
})
addLayer("e", {
    name: "electrons",
    startData() {return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        softcap_mult: new Decimal(10),
        button1: {
            bpm: new Decimal(10),
            // swapped because of bad decisions
            combo: new Decimal(0),
            higgs: new Decimal(0),
            best: new Decimal(0),
            keep: new Decimal(0.9),
            min: new Decimal(0.4),
            max: new Decimal(0.6),
            bar: new Decimal(0),
            eff: new Decimal(0)
        },
        button2: {
            neutrino: new Decimal(1),
            ng: new Decimal(69420),
            time: new Decimal(0),
            timeff: new Decimal(1),
            eff: new Decimal(0)
        },
        button3: {
            energy: new Decimal(0),
            ptower: 1,
            bar: new Decimal(0)
        }
    }},
    color: "#224488",
    row: 3,
    resource: "electrons",
    effect() {
        let eff = player.e.points.add(1).log10()
        let softcap = player.e.softcap_mult
        while (eff.gte(softcap)) {
            eff = eff.log10().mul(softcap.div(softcap.log10()))
            softcap = softcap.mul(player.e.softcap_mult)
        }
        return eff
    },
    layerShown() {return player.l.upgrades.includes(25)},
    symbol: "E",
    position: 1,
    branches: ["a", "u"],
    tooltip: "",
    glowColor() {
        for ([key, value] of Object.entries(tmp.e.upgrades)) {
            if (value.canAfford && !(player.e.upgrades.includes(key))) {
                return "#0000ff"
            }
        }
        return false
    },
    type: "normal",
    baseResource: "",
    baseAmount: new Decimal(1),
    requires: new Decimal(0),
    update(diff) {
        // button 1
        if (player.e.unlocked) {
            player.e.button1.bar = player.e.button1.bar.add(player.e.button1.bpm.div(60).mul(diff))
            if (player.e.button1.bar.gt(1)) {
                player.e.button1.bar = new Decimal(0)
            }
            if (player.e.upgrades.includes(11)) {
                player.e.button1.min = new Decimal(0.35)
                player.e.button1.max = new Decimal(0.65)
            }
            if (player.e.upgrades.includes(32)) {
                player.e.button1.keep = new Decimal(0.91)
            }
            if (player.e.upgrades.includes(32)) {
                player.e.button1.keep = new Decimal(0.93)
            }
            let eff1 = player.e.button1.best.add(1).log10()
            if (player.e.upgrades.includes(32)) {
                eff1 = eff1.pow(1.5)
            }
            if (player.e.upgrades.includes(13)) {
                eff1 = eff1.pow(10)
            }
            player.e.button1.eff = eff1
            player.e.buyables[11] = player.e.buyables[11].add(eff1.mul(diff))
        }
        // button 2
        if (player.e.upgrades.includes(15)) {
            player.e.button2.ng = new Decimal(69420).sub(tmp.e.buyables[171].effect)
            let timeff1 = player.e.button2.time.add(2).log2()
            if (player.e.upgrades.includes(22)) {
                timeff1 = timeff1.sqr()
            }
            if (player.e.upgrades.includes(24)) {
                timeff1 = timeff1.sqr()
            }
            player.e.button2.timeff = timeff1
            player.e.button2.neutrino = player.e.button2.neutrino.add(tmp.e.buyables[91].effect.mul(diff).mul(timeff1))
            player.e.buyables[21] = player.e.buyables[21].add(tmp.e.buyables[171].effect.mul(diff))
        }
        // button 3
        if (player.e.upgrades.includes(35)) {
            let ptower = new Decimal(1)
            if (player.e.upgrades.includes(41)) {
                ptower = ptower.add(1)
            }
            if (player.e.upgrades.includes(42)) {
                ptower = ptower.add(tmp.e.upgrades[42].effect)
            }
            if (player.e.upgrades.includes(43)) {
                ptower = ptower.add(tmp.e.upgrades[43].effect)
            }
            if (player.e.upgrades.includes(44)) {
                ptower = ptower.add(tmp.e.upgrades[44].effect)
            }
            player.e.button3.ptower = ptower
        }
        // dimensions
        if (player.e.buyables[11].gte(1)) {
            player.e.points = player.e.points.add(tmp.e.buyables[11].effect.mul(diff))
        }
        if (player.e.buyables[21].gte(1)) {
            player.e.buyables[11] = player.e.buyables[11].add(tmp.e.buyables[21].effect.mul(diff))
        }
        if (player.e.buyables[31].gte(1)) {
            player.e.buyables[21] = player.e.buyables[21].add(tmp.e.buyables[31].effect.mul(diff))
        }
        // neutrino dimensions
        if (player.e.buyables[101].gte(1)) {
            player.e.buyables[91] = player.e.buyables[91].add(tmp.e.buyables[101].effect.mul(diff))
        }
    },
    buyables: {
        11: {
            title: "Normal Dimensions",
            effect() {
                let gain = new Decimal(10).pow(player.e.buyables[11])
                return gain
            },
            display() {
                return `Produces electrons.
                Currently: ${format(tmp.e.buyables[11].effect, 2)}/s
                Amount: ${format(player.e.buyables[11], 2)}`
            },
            unlocked() {return player.e.unlocked},
            canAfford() {return false},
            buy() {return},
            style: {"height": "100px", "width": "200px"}
        },
        21: {
            title: "Meta Dimensions",
            effect() {
                let gain = new Decimal(10).pow(player.e.buyables[21])
                return gain
            },
            display() {
                return `Produces normal dimensions.
                Currently: ${format(tmp.e.buyables[21].effect, 2)}/s
                Amount: ${format(player.e.buyables[21], 2)}`
            },
            unlocked() {return player.e.upgrades.includes(15)},
            canAfford() {return false},
            buy() {return},
            style: {"height": "100px", "width": "200px"}
        },
        31: {
            title: "Meta^2 Dimensions",
            effect() {
                let gain = new Decimal(10).pow(player.e.buyables[31])
                return gain
            },
            display() {
                return `Produces meta dimensions.
                Currently: ${format(tmp.e.buyables[31].effect, 2)}/s
                Amount: ${format(player.e.buyables[31], 2)}`
            },
            unlocked() {return player.e.upgrades.includes(35)},
            canAfford() {return false},
            buy() {return},
            style: {"height": "100px", "width": "200px"}
        },
        91: {
            title: "1st Neutrino Dimension",
            cost() {return new Decimal(1).mul(new Decimal(10).pow(player.e.buyables[91]))},
            effect() {
                let gain = player.e.buyables[91]
                let pow = new Decimal(1).div(player.e.button2.ng)
                if (player.e.upgrades.includes(21)) {
                    pow = pow.pow(0.1)
                }
                if (player.e.upgrades.includes(24)) {
                    pow = pow.pow(0.5)
                }
                let mult = new Decimal(1)
                if (player.e.upgrades.includes(53)) {
                    mult = mult.mul(tmp.e.upgrades[53].effect)
                }
                if (player.e.upgrades.includes(63)) {
                    mult = mult.mul(tmp.e.upgrades[63].effect)
                }
                return gain.pow(pow).mul(mult)
            },
            display() {
                return `Produces neutrinos.
                Currently: ${format(tmp.e.buyables[91].effect, 2)}/s
                Cost: ${format(tmp.e.buyables[91].cost, 2)}
                Amount: ${format(player.e.buyables[91], 2)}`
            },
            unlocked() {return player.e.upgrades.includes(15)},
            canAfford() {return player.e.button2.neutrino.gte(tmp.e.buyables[91].cost)},
            buy() {
                player.e.button2.neutrino = player.e.button2.neutrino.sub(tmp.e.buyables[91].cost)
                player.e.buyables[91] = player.e.buyables[91].add(1)
            },
            style: {"height": "100px", "width": "200px"}
        },
        101: {
            title: "2nd Neutrino Dimension",
            cost() {return new Decimal(100).mul(new Decimal(1000).pow(player.e.buyables[101]))},
            effect() {
                let gain = player.e.buyables[101]
                if (player.e.upgrades.includes(52)) {
                    gain = gain.mul(tmp.e.upgrades[52].effect)
                }
                if (player.e.upgrades.includes(54)) {
                    gain = gain.mul(player.e.button2.timeff)
                }
                return gain
            },
            display() {
                return `Produces 1st neutrino dimensions.
                Currently: ${format(tmp.e.buyables[101].effect, 2)}/s
                Cost: ${format(tmp.e.buyables[101].cost, 2)}
                Amount: ${format(player.e.buyables[101], 2)}`
            },
            unlocked() {return player.e.upgrades.includes(51)},
            canAfford() {return player.e.button2.neutrino.gte(tmp.e.buyables[101].cost)},
            buy() {
                player.e.button2.neutrino = player.e.button2.neutrino.sub(tmp.e.buyables[101].cost)
                player.e.buyables[101] = player.e.buyables[101].add(1)
            },
            style: {"height": "100px", "width": "200px"}
        },
        171: {
            title: "Neutrino Buffers",
            cost() {
                let base = new Decimal(1.5)
                if (player.e.upgrades.includes(22)) {
                    base = base.sub(0.25)
                }
                return base.pow(base.pow(player.e.buyables[171]))
            },
            effect() {
                let gain = player.e.buyables[171]
                if (player.e.upgrades.includes(23)) {
                    gain = gain.mul(50)
                }
                return gain
            },
            display() {
                return `Reduces NG- debuffs and produces meta dimensions.
                Currently: ${format(tmp.e.buyables[171].effect, 2)}
                Cost: ${format(tmp.e.buyables[171].cost, 2)}
                Amount: ${format(player.e.buyables[171], 2)}`
            },
            unlocked() {return player.e.upgrades.includes(15)},
            canAfford() {return player.e.button2.neutrino.gte(tmp.e.buyables[171].cost)},
            buy() {
                player.e.button2.neutrino = player.e.button2.neutrino.sub(tmp.e.buyables[171].cost)
                player.e.buyables[171] = player.e.buyables[171].add(1)
            },
            style: {"height": "100px", "width": "200px"}
        }
    },
    clickables: {
        11: {
            title: "Generic Button #1",
            display() {
                return `Clicking this button while the bar below is between ${format(player.e.button1.min.mul(100), 2)}% and ${format(player.e.button1.max.mul(100), 2)}% will collide two particles successfully, gaining combo and higgs bosons, and increasing particle speed.<br>
                If not clicked within this range, combo and ${format(new Decimal(1).sub(player.e.button1.keep).mul(100), 2)}% of higgs bosons are lost and particle speed resets.<br>
                Your best higgs bosons are producing ${format(player.e.button1.eff, 2)} normal dimensions per second.`
            },
            unlocked() {return player.e.unlocked},
            canClick() {return true},
            onClick() {
                if (player.e.button1.bar.gte(player.e.button1.min) && player.e.button1.bar.lte(player.e.button1.max)) {
                    let combo = player.e.button1.higgs.add(2).log2()
                    if (player.e.upgrades.includes(11)) {
                        combo = combo.add(1)
                    }
                    if (player.e.upgrades.includes(12)) {
                        combo = combo.mul(2)
                    }
                    if (player.e.upgrades.includes(31)) {
                        combo = combo.mul(tmp.e.upgrades[31].effect)
                    }
                    if (player.e.upgrades.includes(33)) {
                        combo = combo.mul(tmp.e.upgrades[33].effect)
                    }
                    if (player.e.upgrades.includes(34)) {
                        combo = combo.mul(tmp.e.upgrades[34].effect)
                    }
                    if (player.e.upgrades.includes(61) && player.e.button1.bar.gte(0.45) && player.e.button1.bar.lte(0.55)) {
                        combo = combo.mul(10)
                    }
                    if (player.e.upgrades.includes(62)) {
                        combo = combo.mul(player.e.button1.bar.mul(100))
                    }
                    if (player.e.upgrades.includes(64)) {
                        combo = combo.mul(tmp.e.upgrades[64].effect)
                    }
                    if (player.e.upgrades.includes(12)) {
                        combo = combo.sqr()
                    }
                    let bpm = new Decimal(1)
                    if (player.e.upgrades.includes(12)) {
                        bpm = bpm.add(0.5)
                    }
                    if (player.e.upgrades.includes(13)) {
                        bpm = bpm.sub(0.75)
                    }
                    player.e.button1.higgs = player.e.button1.higgs.add(1)
                    player.e.button1.combo = player.e.button1.combo.add(combo)
                    player.e.button1.bpm = player.e.button1.bpm.add(bpm)
                    if (player.e.button1.combo.gt(player.e.button1.best)) {
                        player.e.button1.best = player.e.button1.combo
                    }
                }
                else {
                    player.e.button1.higgs = new Decimal(0)
                    let keep = new Decimal(0.9)
                    if (player.e.upgrades.includes(31)) {
                        keep = keep.add(0.01)
                    }
                    if (player.e.upgrades.includes(61)) {
                        keep = keep.add(0.02)
                    }
                    player.e.button1.combo = player.e.button1.combo.mul(keep)
                    player.e.button1.bpm = new Decimal(10)
                }
            },
            style: {"height": "200px", "width": "200px"}
        },
        12: {
            title: "Generic Button #2",
            display() {
                return `Holding this button down will increase time multi.<br>
                Time multi boosts 1st neutrino dimensions after debuffs.<br>
                Currently: ${format(player.e.button2.timeff, 2)}x`
            },
            unlocked() {return player.e.upgrades.includes(15)},
            canClick() {return true},
            onHold() {
                let mult = new Decimal(1)
                player.e.button2.time = player.e.button2.time.add(new Decimal(0.05).mul(mult))
            },
            style: {"height": "200px", "width": "200px"}
        },
        13: {
            title: "Generic Button #3",
            display() {
                return `Holding this button down will fill up the bar below. Releasing the button before the bar is fully filled will give energy.<br>
                If the bar is released after the bar is fully filled, it will not give any energy.`
            },
            unlocked() {return player.e.upgrades.includes(35)},
            canClick() {return true},
            onClick() {
                let fill = new Decimal(100).pow(player.e.button3.bar).div(100).sub(0.01)
                if (fill.lte(1)) {
                    let gain = new Decimal(Math.E).tetrate(player.e.button3.ptower).tetrate(fill)
                    player.e.button3.energy = player.e.button3.energy.add(gain)
                    let dims = fill
                    if (player.e.upgrades.includes(42)) {
                        dims = dims.mul(2)
                    }
                    if (player.e.upgrades.includes(43)) {
                        dims = dims.pow(2)
                    }
                    if (player.e.upgrades.includes(44)) {
                        dims = dims.tetrate(2)
                    }
                    if (player.e.upgrades.includes(64)) {
                        dims = dims.mul(tmp.e.upgrades[64].effect)
                    }
                    if (player.e.upgrades.includes(41)) {
                        player.e.buyables[31] = player.e.buyables[31].add(dims)
                    }
                }
                player.e.button3.bar = new Decimal(0)
            },
            onHold() {
                let mult = new Decimal(1)
                if (player.e.upgrades.includes(41)) {
                    mult = mult.mul(3)
                }
                player.e.button3.bar = player.e.button3.bar.add(new Decimal(0.01).mul(mult))
            },
            style: {"height": "200px", "width": "200px"}
        }
    },
    bars: {
        one: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() {return player.e.button1.bar},
            display() {
                return `Currently: ${format(player.e.button1.bar.mul(100), 2)}%`
            },
            fillStyle() {return player.e.button1.bar.gte(player.e.button1.min) && player.e.button1.bar.lte(player.e.button1.max) ? {"background-color": "#77bf5f", "transition-duration": "0.1s"} : {"background-color": "#ffffff", "transition-duration": "0.1s"}},
            textStyle: {"color": "#888888"}
        },
        three: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() {return new Decimal(100).pow(player.e.button3.bar).div(100).sub(0.01)},
            display() {
                return `Currently: ${format(new Decimal(100).pow(player.e.button3.bar).div(100).sub(0.01).mul(100), 2)}%`
            },
            fillStyle() {
                let fill = new Decimal(100).pow(player.e.button3.bar).div(100).sub(0.01)
                if (fill.lte(.5)) {return {"background-color": "#77bf5f", "transition-duration": "0.05s"}}
                if (fill.lte(.75)) {return {"background-color": "#ffa500", "transition-duration": "0.05s"}}
                return {"background-color": "#ff0000", "transition-duration": "0.05s"}
            },
            textStyle: {"color": "#888888"},
            unlocked() {return player.e.upgrades.includes(35)}
        }
    },
    upgrades: {
        11: {
            fullDisplay() {
                return `<h3>Ain't got rhythm</h3><br>
                Increase the range for successful collisions and each successful collision gives +1 higgs boson.<br>
                Req: 1e50 electrons`
            },
            canAfford() {return player.e.points.gte(1e50)},
            pay() {return}
        },
        12: {
            fullDisplay() {
                return `<h3>A glimpse of QOL</h3><br>
                Tau's second bar moves twice as fast and gain x2 higgs bosons but successful collisions give +0.5 particle speed.<br>
                Req: e8,000,000 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(11)},
            canAfford() {return player.l.tau.gte("e8000000")},
            pay() {return}
        },
        13: {
            fullDisplay() {
                return `<h3>Bug: game sucks</h3><br>
                Higgs boson effect ^10 and higgs boson gain ^2.<br>
                Req: e10,000,000 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(12)},
            canAfford() {return player.l.tau.gte("e10000000")},
            pay() {return}
        },
        14: {
            fullDisplay() {
                return `<h3>Quality of death</h3><br>
                Particle speed per successful collision -0.75 and higgs boson's effect boosts tau gain.<br>
                Req: e100,000,000 electrons<br>
                Currently: ^${format(tmp.e.upgrades[14].effect, 2)}`
            },
            effect() {return player.e.button1.eff.add(10).log10().min(15)},
            unlocked() {return player.e.upgrades.includes(13)},
            canAfford() {return player.e.points.gte("e100000000")},
            pay() {return}
        },
        15: {
            fullDisplay() {
                return `<h3>Yet another meta joke</h3><br>
                Unlock meta dimensions.<br>
                Req: e333,333,333 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(14)},
            canAfford() {return player.l.tau.gte("e333333333")},
            pay() {return}
        },
        21: {
            fullDisplay() {
                return `<h3>Infinity</h3><br>
                Neutrino gain debuff ^0.1.<br>
                Req: 100 neutrinos`
            },
            unlocked() {return player.e.upgrades.includes(15)},
            canAfford() {return player.e.button2.neutrino.gte(100)},
            pay() {return}
        },
        22: {
            fullDisplay() {
                return `<h3>Eternity</h3><br>
                Time multi ^2 and neutrino buffers have slower cost scaling.<br>
                Req: 1,000 neutrinos`
            },
            unlocked() {return player.e.upgrades.includes(21)},
            canAfford() {return player.e.button2.neutrino.gte(1000)},
            pay() {return}
        },
        23: {
            fullDisplay() {
                return `<h3>Quantum</h3><br>
                Neutrino buffer's effect x50.<br>
                Req: e900,000,000 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(22)},
            canAfford() {return player.l.tau.gte("e900000000")},
            pay() {return}
        },
        24: {
            fullDisplay() {
                return `<h3>Ghostify</h3><br>
                Neutrino gain debuff ^0.5 and time multi ^2.<br>
                Req: e2.4e9 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(23)},
            canAfford() {return player.l.tau.gte("e2.4e9")},
            pay() {return}
        },
        25: {
            fullDisplay() {
                return `<h3>NG+</h3><br>
                Unlock 5 upgrades in the normal dimensions task.<br>
                Req: x3,000 time multi`
            },
            unlocked() {return player.e.upgrades.includes(24)},
            canAfford() {return player.e.button2.timeff.gte(3000)},
            pay() {return}
        },
        31: {
            fullDisplay() {
                return `<h3>Osu</h3><br>
                Best higgs bosons boost higgs boson gain and lose 1% less higgs bosons on unsuccessful collisions.<br>
                Req: 1,000,000 neutrinos<br>
                Currently: x${format(tmp.e.upgrades[31].effect, 2)}`
            },
            effect() {return player.e.button1.best.add(1).slog().add(2).log2()},
            unlocked() {return player.e.upgrades.includes(25)},
            canAfford() {return player.e.button2.neutrino.gte(1000000)},
            pay() {return}
        },
        32: {
            fullDisplay() {
                return `<h3>Polyrhythmic</h3><br>
                Higgs boson effect ^1.5.<br>
                Req: e3.2e9 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(31)},
            canAfford() {return player.l.tau.gte("e3.2e9")},
            pay() {return}
        },
        33: {
            fullDisplay() {
                return `<h3>Judgement 7</h3><br>
                Higgs boson effect boosts higgs boson gain.<br>
                Req: e5e36 points<br>
                Currently: x${format(tmp.e.upgrades[33].effect, 2)}`
            },
            effect() {return player.e.button1.eff.add(1).log10()},
            unlocked() {return player.e.upgrades.includes(32)},
            canAfford() {return player.points.gte("e5e36")},
            pay() {return}
        },
        34: {
            fullDisplay() {
                return `<h3>Funk nights at friday</h3><br>
                Higgs bosons boost higgs boson gain.<br>
                Req: e6.8e9 tau particles<br>
                Currently: x${format(tmp.e.upgrades[34].effect, 2)}`
            },
            effect() {return player.e.button1.combo.add(10).log10()},
            unlocked() {return player.e.upgrades.includes(33)},
            canAfford() {return player.l.tau.gte("e6.8e9")},
            pay() {return}
        },
        35: {
            fullDisplay() {
                return `<h3>Hold notes</h3><br>
                Unlock meta^2 dimensions.<br>
                Req: e7.7e9 tau particles`
            },
            unlocked() {return player.e.upgrades.includes(34)},
            canAfford() {return player.l.tau.gte("e7.7e9")},
            pay() {return}
        },
        41: {
            fullDisplay() {
                return `<h3>Monster energy</h3><br>
                The bar fills thrice as fast but increase power tower height by 1, and every time you successfully gain energy, you gain meta^2 dimensions equal to the percentage of the bar filled.<br>
                Req: 10 energy`
            },
            unlocked() {return player.e.upgrades.includes(35)},
            canAfford() {return player.e.button3.energy.gte(10)},
            pay() {return}
        },
        42: {
            fullDisplay() {
                return `<h3>Kinetic</h3><br>
                Energy boosts power tower height and meta^2 dimension gain x2.<br>
                Req: 200 energy<br>
                Currently: +${format(tmp.e.upgrades[42].effect, 2)}`
            },
            effect() {return player.e.button3.energy.slog().slog().add(1)},
            unlocked() {return player.e.upgrades.includes(41)},
            canAfford() {return player.e.button3.energy.gte(200)},
            pay() {return}
        },
        43: {
            fullDisplay() {
                return `<h3>Electron-lytes</h3><br>
                Best higgs bosons boost power tower height and meta^2 dimension gain ^2.<br>
                Req: 1e24 energy<br>
                Currently: +${format(tmp.e.upgrades[43].effect, 2)}`
            },
            effect() {return player.e.button1.best.slog().slog().add(1)},
            unlocked() {return player.e.upgrades.includes(42)},
            canAfford() {return player.e.button3.energy.gte(1e24)},
            pay() {return}
        },
        44: {
            fullDisplay() {
                return `<h3>Quanta</h3><br>
                Neutrinos boost power tower height and meta^2 dimension gain ^^2.<br>
                Req: eee200 electrons<br>
                Currently: +${format(tmp.e.upgrades[44].effect, 2)}`
            },
            effect() {return player.e.button2.neutrino.slog().slog().add(1)},
            unlocked() {return player.e.upgrades.includes(43)},
            canAfford() {return player.e.points.gte("eee200")},
            pay() {return}
        },
        45: {
            fullDisplay() {
                return `<h3>Blue bulled</h3><br>
                Unlock 5 new upgrades in the meta dimensions task.<br>
                Req: eee1000 electrons`
            },
            unlocked() {return player.e.upgrades.includes(44)},
            canAfford() {return player.e.points.gte("eee1000")},
            pay() {return}
        },
        51: {
            fullDisplay() {
                return `<h3>100 is a little</h3><br>
                Unlock the second dimension.<br>
                Req: NG-68,420 or less`
            },
            unlocked() {return player.e.upgrades.includes(45)},
            canAfford() {return player.e.button2.ng.lte(68420)},
            pay() {return}
        },
        52: {
            fullDisplay() {
                return `<h3>Newtrinos</h3><br>
                Neutrino buffers boost 2nd neutrino dimensions.<br>
                Req: 100 1st neutrino dimensions<br>
                Currently: x${format(tmp.e.upgrades[52].effect, 2)}`
            },
            effect() {return player.e.buyables[171].add(1)},
            unlocked() {return player.e.upgrades.includes(51)},
            canAfford() {return player.e.buyables[91].gte(100)},
            pay() {return}
        },
        53: {
            fullDisplay() {
                return `<h3>Faster than sound</h3><br>
                1st neutrino dimensions boost neutrino gain.<br>
                Req: 50,000,000 neutrinos<br>
                Currently: x${format(tmp.e.upgrades[53].effect, 2)}`
            },
            effect() {return player.e.buyables[91].add(10).log10()},
            unlocked() {return player.e.upgrades.includes(52)},
            canAfford() {return player.e.button2.neutrino.gte(50000000)},
            pay() {return}
        },
        54: {
            fullDisplay() {
                return `<h3>Slower than light</h3><br>
                Time multi boosts 2nd neutrino dimensions.<br>
                Req: 21 neutrino buffers`
            },
            unlocked() {return player.e.upgrades.includes(53)},
            canAfford() {return player.e.buyables[171].gte(21)},
            pay() {return}
        },
        55: {
            fullDisplay() {
                return `<h3>NG^</h3><br>
                Unlock 5 upgrades in the normal dimensions task.<br>
                Req: 22 neutrino buffers`
            },
            unlocked() {return player.e.upgrades.includes(54)},
            canAfford() {return player.e.buyables[171].gte(22)},
            pay() {return}
        },
        61: {
            fullDisplay() {
                return `<h3>DDR</h3><br>
                Clicking the button while the bar is between 45% and 55% will grant 10x higgs bosons and lose 2% less higgs bosons on unsuccessful collisions.<br>
                Req: 1e11 neutrinos`
            },
            unlocked() {return player.e.upgrades.includes(55)},
            canAfford() {return player.e.button2.neutrino.gte(1e11)},
            pay() {return}
        },
        62: {
            fullDisplay() {
                return `<h3>Jumpstream</h3><br>
                Bar percentage boosts higgs boson gain, and best higgs bosons boost tau effect.<br>
                Req: e5.2e10 tau particles<br>
                Currently: x${format(player.e.button1.bar.mul(100), 2)}, x${format(tmp.e.upgrades[62].effect, 2)}`
            },
            effect() {return player.e.button1.best.add(10).log10()},
            unlocked() {return player.e.upgrades.includes(61)},
            canAfford() {return player.l.tau.gte("e5.2e10")},
            pay() {return}
        },
        63: {
            fullDisplay() {
                return `<h3>Handstream</h3><br>
                Higgs boson effect boosts neutrino gain.<br>
                Req: e2e38 points<br>
                Currently: x${format(tmp.e.upgrades[63].effect, 2)}`
            },
            effect() {return player.e.button1.eff.add(10).log10()},
            unlocked() {return player.e.upgrades.includes(62)},
            canAfford() {return player.points.gte("e2e38")},
            pay() {return}
        },
        64: {
            fullDisplay() {
                return `<h3>Oni mode</h3><br>
                Neutrinos boost higgs boson gain and meta^2 dimensions after tetration.<br>
                Req: 1e13 neutrinos<br>
                Currently: x${format(tmp.e.upgrades[64].effect, 2)}`
            },
            effect() {return player.e.button2.neutrino.pow(0.1)},
            unlocked() {return player.e.upgrades.includes(63)},
            canAfford() {return player.e.button2.neutrino.gte(1e13)},
            pay() {return}
        },
        65: {
            fullDisplay() {
                return `<h3>Mines</h3><br>
                Unlock [not yet].<br>
                Req: eee25,000 electrons`
            },
            unlocked() {return player.e.upgrades.includes(64)},
            canAfford() {return player.e.points.gte("eee25000")},
            pay() {return}
        }
    },
    tabFormat: {
        "Dims": {
            content: [
                [
                    "display-text",
                    function() {
                        return `You have <h2 style='color: #224488; text-shadow: #224488 0px 0px 10px'>${format(player.e.points, 2)}</h2> electrons<br>
                        Your electrons are raising tau gain to the ${format(tmp.e.effect, 2)}th power<br>
                        Softcap mult: Every time the electron effect reaches a power of <h3 style='color: #224488; text-shadow: #224488 0px 0px 10px'>${format(player.e.softcap_mult, 2)}</h3>, it is softcapped. (log10(effect))`
                    }
                ],
                ["buyable", 11],
                ["buyable", 21],
                ["buyable", 31]
            ]
        },
        "Tasks": {
            content: [
                [
                    "display-text",
                    function() {
                        return `Normal Dimensions: Particle Colliding<br><br>
                        The current particle speed is ${format(player.e.button1.bpm, 2)} bpm<br>
                        You have ${format(player.e.button1.combo, 2)} higgs bosons<br>
                        You have ${format(player.e.button1.higgs, 2)} combo, boosting higgs boson gain by x${format(player.e.button1.higgs.add(2).log2(), 2)}<br>
                        Your best higgs bosons is ${format(player.e.button1.best, 2)}`
                    }
                ],
                "blank",
                ["clickable", 11],
                "blank",
                ["bar", "one"],
                ["upgrades", [1, 3, 6]],
                [
                    "display-text",
                    function() {
                        if (player.e.upgrades.includes(15)) {
                            let str = `Meta Dimensions: Neutrino Dimensions NG-${format(player.e.button2.ng, 2)}<br><br>
                            Debuffs:<br>
                            - You start with 1 dimension<br>
                            - Neutrino gain ^1/${format(player.e.button2.ng, 2)}<br>
                            - Multiplier per bought dimension, tickspeed, dimension shifts and boosts, and neutrino galaxies don't exist<br><br>
                            You have ${format(player.e.button2.neutrino, 2)} neutrinos`
                            return str
                        }
                    }
                ],
                "blank",
                ["clickable", 12],
                ["buyable", 91],
                ["buyable", 101],
                ["buyable", 171],
                ["upgrades", [2, 5]],
                [
                    "display-text",
                    function() {
                        if (player.e.upgrades.includes(35)) {
                            let str = `Meta^2 Dimensions: Particle Energizing<br><br>
                            You have ${format(player.e.button3.energy, 2)} energy<br>
                            Your power tower height is ${format(player.e.button3.ptower, 2)}<br>
                            Energy gain is equal to:<br>
                            (e^e^...^e)^^x<br>
                            where the number of e's is equal to your power tower height`
                            return str
                        }
                    }
                ],
                "blank",
                ["clickable", 13],
                "blank",
                ["bar", "three"],
                ["upgrades", [4]]
            ]
        }
    }
})