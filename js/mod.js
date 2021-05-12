let modInfo = {
	name: "The Chemistree 2",
	id: "chem2",
	author: "micro",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3",
	name: "does anyone actually look at these? if you see this then good for you",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- the tree exists now<br>
		- added stuff until 10th quark upgrade<br>
		- next up: leptons and alignment charts<br>
	<h3>v0.1</h3><br>
		- leptons exist now<br>
		- added stuff until 15th quark upgrade<br>
		- next up: net neutrality<br>
	<h3>v0.2</h3><br>
		- neutral alignments don't exist lol<br>
		- but atoms do<br>
		- added stuff until 20th quark upgrade<br>
		- next up: something actually interesting maybe<br>
	<h3>v0.3</h3><br>
		- tricked and fooled you ill never add interesting things<br>
		- mu(wu)ons exist now<br>
		- added stuff until 22th quark upgrade<br>
		- next up: the thing i planned in v0.1<br>`

let winText = `youre done pog`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	let gain = new Decimal(1)
    gain = gain.add(tmp.q.buyables[11].effect)
	gain = gain.add(tmp.q.buyables[12].effect[0])

	if (player.q.upgrades.includes(12)) {
		gain = gain.mul(tmp.q.upgrades[12].effect)
	}
	if (player.l.challenges[12] === 1) {
		gain = gain.mul(6.9e69)
	}

	if (player.q.upgrades.includes(14)) {
		gain = gain.pow(tmp.q.upgrades[14].effect)
	}
	if (player.q.upgrades.includes(23)) {
		gain = gain.pow(1.5)
	}
	if (player.q.upgrades.includes(24)) {
		gain = gain.pow(1.5)
	}
	if (player.l.unlocked) {
		gain = gain.pow(tmp.l.effect[4])
	}
	if (player.q.upgrades.includes(35)) {
		gain = gain.pow(1.11)
	}
	if (player.a.milestones.includes("1")) {
		gain = gain.pow(new Decimal(1.01).pow(player.a.points))
	}
	if (player.a.milestones.includes("2")) {
		gain = gain.pow(new Decimal(1.0001).pow(player.q.points))
	}
	if (player.a.milestones.includes("3")) {
		gain = gain.pow(new Decimal(1.05).pow(player.l.points))
	}
	if (player.q.upgrades.includes(41)) {
		gain = gain.pow(2)
	}
	if (player.q.upgrades.includes(42)) {
		gain = gain.pow(3)
	}
	if (player.q.upgrades.includes(43)) {
		gain = gain.pow(4)
	}
	if (player.q.upgrades.includes(44)) {
		gain = gain.pow(1.017100171)
	}
	if (player.q.upgrades.includes(45)) {
		gain = gain.pow(new Decimal(1.01).pow(player.l.comps))
	}
	if (player.q.upgrades.includes(51)) {
		gain = gain.pow(tmp.q.upgrades[51].effect)
	}
	if (player.q.buyables[13].gte(1)) {
		gain = gain.pow(tmp.q.buyables[13].effect[0]).mul(tmp.q.buyables[13].effect[1])
	}
	if (player.l.activeChallenge === 12) {
		gain = gain.tetrate(0.1)
	}
	if (!!(player.l.activeChallenge)) {
		gain = gain.log10()
	}
	if (player.l.activeChallenge === 13) {
		gain = gain.tetrate(0.5)
	} 
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}


// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function addAlignments() {
	player.l.law = new Decimal(1)
    player.l.chaos = new Decimal(1)
    player.l.good = new Decimal(1)
    player.l.evil = new Decimal(1)
	player.l.unlocked = true
}