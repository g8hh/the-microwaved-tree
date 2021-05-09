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
    symbol: "Q",
    position: 0,
    type: "static",
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(1),
    exponent: function() {return player.q.best.div(100).add(1)},
    base: 2,
    buyables: {
        11: {
            title: "Up Quark",
            cost(x) {return new Decimal(1)},
            effect(x) {
                let gain = player.q.buyables[11]
                if (player.q.upgrades.includes(11)) {
                    gain *= 3
                }
                return gain
            },
            display() {
                return `Increases point gain by 1.
                Cost: 1 quark
                Currently: ${tmp.q.buyables[11].effect.toPrecision(3)}
                Amount: ${player.q.buyables[11]}`
            },
            canAfford() {return player.q.points.sub(player.q.spent).gte(1)},
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
                    gain = gain.log10().mul(cap)
                }
                else {
                    gain = gain.min(cap)
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
            canAfford() {return player.q.points.sub(player.q.spent).gte(1)},
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
                Unlocks [a cool thing thats coming later]<br>
                Cost: 1e18 points`
            },
            unlocked() {return player.q.upgrades.includes(24)},
            canAfford() {return player.points.gte(1e18)},
            pay() {
                player.points = player.points.sub(1e18)
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