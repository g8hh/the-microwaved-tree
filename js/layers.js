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
            onPress() { if (player.q.unlocked) doReset("q") }
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
        return exp
    },
    base: 2,
    autoPrestige() {return player.q.upgrades.includes(31)},
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
                return [pow, mult]
            },
            display() {
                return `Point gain ^${tmp.q.buyables[13].effect[0].toPrecision(3)}, but point gain ${tmp.q.buyables[13].effect[1].toPrecision(3)}x afterwards, based on points.
                Cost: 1 quark
                Amount: ${player.q.buyables[13]}`
            },
            unlocked() {return player.q.upgrades.includes(15)},
            canAfford() {return player.q.points.sub(player.q.spent).gte(1)},
            buy() {
                player.q.spent = player.q.spent.add(1)
                player.q.buyables[13] = player.q.buyables[13].add(1)
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
                Unlocks [something cool].<br>
                Cost: 1e90 points`
            },
            unlocked() {return player.l.points.gte(20)},
            canAfford() {return player.points.gte(1e90)},
            pay() {
                player.points = player.points.sub(1e90)
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
        law: new Decimal(0),
        chaos: new Decimal(0),
        good: new Decimal(0),
        evil: new Decimal(0),
        neutral: new Decimal(0),
        alignments: new Decimal(0),
        cap: new Decimal(1)
    }},
    color: "#654321",
    row: 0,
    resource: "leptons",
    effect() {
        let strength = player.l.points.sqrt().add(2).log2().sqrt()
        if (player.q.upgrades.includes(34)) {
            strength = strength.sqr()
        }
        let al1 = new Decimal(2).mul(player.l.law.gte(1) ? player.l.law : new Decimal(0.5)).pow(strength)
        let al2 = new Decimal(10).pow(player.l.chaos).pow(strength)
        let al3 = new Decimal(0.5).pow(player.l.good.sqrt()).pow(strength.sqrt())
        let al4 = new Decimal(1.25).mul(player.l.evil.gte(1) ? player.l.evil : new Decimal(0.8)).pow(strength)
        return [strength, al1, al2, al3, al4]
    },
    effectDescription: function() {return `which are boosting alignment boosts by ^${tmp.l.effect[0].toPrecision(3)}`},
    layerShown() {return player.q.upgrades.includes(25)},
    symbol: "L",
    position: 1,
    branches: ["q"],
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1e18),
    exponent: function() {return player.l.best.div(100).add(1).sqr()},
    base: function() {return player.l.best.div(10).add(10)},
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
            player.l.clickables[11] = "Inactive"
            player.l.clickables[13] = "Inactive"
            player.l.clickables[31] = "Inactive"
            player.l.clickables[33] = "Inactive"
        },
        masterButtonText: "Respec alignments",
        showMasterButton() {return player.l.unlocked}
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        [
            "display-text",
            function() {
                return `You have <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${player.l.law}</h2> law, which is raising up quark's effect to the <h2 style='color: #ffffff; text-shadow: #ffffff 0px 0px 10px'>${tmp.l.effect[1].toPrecision(3)}</h2>th power<br>
                You have <h2 style='color: #000000; text-shadow: #ffffff 0px 0px 10px'>${player.l.chaos}</h2> chaos, which is multiplying down quark's effect by <h2 style='color: #000000; text-shadow: #ffffff 0px 0px 10px'>${tmp.l.effect[2].toPrecision(3)}</h2><br>
                You have <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${player.l.good}</h2> good, which is multiplying quark requirement's second exponent by <h2 style='color: #cccccc; text-shadow: #cccccc 0px 0px 10px'>${tmp.l.effect[3].toPrecision(3)}</h2><br>
                You have <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${player.l.evil}</h2> evil, which is raising point gain to the <h2 style='color: #444444; text-shadow: #444444 0px 0px 10px'>${tmp.l.effect[4].toPrecision(3)}</h2>th power<br>
                You can have ${player.l.cap} alignments at a time<br>`
            },
            function() {return player.l.unlocked ? {} : {"display": "none"}}
        ],
        "clickables"
    ]
})