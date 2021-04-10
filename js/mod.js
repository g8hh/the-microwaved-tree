let modInfo = {
	name: "The Tree of Trials",
	id: "trials",
	author: "micro",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Literally something",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- the tree exists now<br>
		- added 2 challenges and some upgrades<br>
		- thats it`

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
	if (!(player.u.upgrades.includes(14))) {
		if (player.u.upgrades.includes(11)) {gain = gain.add(tmp.u.upgrades[11].effect)}
		if (player.u.upgrades.includes(12)) {gain = gain.add(tmp.u.upgrades[12].effect)}
	}
	if (player.t.challenges[12]) {gain = gain.add(player.t.challenges[12])}
	if (player.u.upgrades.includes(21)) {gain = gain.mul(tmp.u.upgrades[21].effect)}
	if (player.t.activeChallenge === 12) {gain = gain.sqr()}

	if (player.t.challenges[11]) {gain = gain.mul(Decimal.pow(2, player.t.challenges[11]))}
	if (player.u.upgrades.includes(14)) {gain = gain.mul(tmp.u.upgrades[14].effect)}
	if (player.u.upgrades.includes(15)) {gain = gain.mul(tmp.u.upgrades[15].effect)}
	if (player.mu.upgrades.includes(11)) {gain = gain.sqr()}

	if (player.t.activeChallenge === 12) {gain = gain.div(player.u.upgrades.length ? player.u.upgrades.length**2 : 1)}
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
	return player.t.challenges[12] > 3
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