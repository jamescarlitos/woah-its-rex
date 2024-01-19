//for the button on the UI
function resetMine() {
    clearInterval(loopTimer);
    currDirection = "";
    mine = [[]];
    layersChanged = {};
    curX = 1000000000;
    curY = 0;
    blocksRevealedThisReset = 0;
    currentLayer = allLayers[0];
    createMine();
    mineCapacity = baseMineCapacity;
    document.getElementById("mineResetProgress").innerHTML = `Reset Progress: ${(blocksRevealedThisReset/mineCapacity*100).toFixed(2)}`;
}

//for the automatic reset to reduce memory
let resetting = false;
async function mineReset() {
    if (!resetting) {
        resetting = true;
        mineCapacity = baseMineCapacity;
        layersChanged = {};
        layersChanged[`${Math.floor(curY/2000)}`] = allLayersNames[allLayers.indexOf(currentLayer)]
        const currDirectionBeforeReset = currDirection;
        currDirection = "";
        const temp = await collectOres(currDirectionBeforeReset);
        canMine = await mineResetAid();
        checkAllAround(curX, curY, 1);
        mine[curY][curX] = "⛏️";
        loggedFinds = [];
        displayArea();
        goDirection(currDirectionBeforeReset);
        resetting = false;
    }
}

function collectOres(inDirection) {
    return new Promise((resolve) => {
    if (gears["infinity-collector"]) {
        for (let i = 0; i < loggedFinds.length; i++) {
            if (mine[loggedFinds[i][0]] !== undefined &&
              mine[loggedFinds[i][0]][loggedFinds[i][1]] !== undefined)
                mineBlock(loggedFinds[i]["x"], loggedFinds[i]["t"], "reset", 1);
        }
    } else {
        let direction = "";
        if (inDirection !== "") direction = inDirection;
        else if (lastDirection !== "") direction = lastDirection;
        if (direction === "s") {
            let constraints = getParams(30, 500);
            for (let r = curY - constraints["up"]; r < curY + 30; r++) {
                for (let c = curX - constraints["left"]; c < curX + 30; c++) {
                    //TODO: make this into a function
                    if (mine[r] !== undefined &&
                      oreList[mine[r][c]] !== undefined &&
                      oreList[mine[r][c]]["prob"] >= 750000)
                        mineBlock(c, r, "reset", 1);
                }
            }
        } else if (direction === "w") {
            let constraints = getParams(30, 30);
            for (let r = curY - constraints["up"]; r < curY + 500; r++) {
                for (let c = curX - constraints["left"]; c < curX + 30; c++) {
                    if (mine[r] !== undefined &&
                      oreList[mine[r][c]] !== undefined &&
                      oreList[mine[r][c]]["prob"] >= 750000)
                        mineBlock(c, r, "reset", 1);
                }
            }
        } else if (direction === "a") {
            let constraints = getParams(30, 30);
            for (let r = curY - constraints["up"]; r < curY + 30; r++) {
                for (let c = curX - constraints["left"]; c < curX + 500; c++) {
                    if (mine[r] !== undefined &&
                      oreList[mine[r][c]] !== undefined &&
                      oreList[mine[r][c]]["prob"] >= 750000)
                        mineBlock(c, r, "reset", 1);
                }
            }
        } else if (direction === "d") {
            let constraints = getParams(500, 30);
            for (let r = curY - constraints["up"]; r < curY + 30; r++) {
                for (let c = curX - constraints["left"]; c < curX + 30; c++) {
                    if (mine[r] !== undefined &&
                      oreList[mine[r][c]] !== undefined &&
                      oreList[mine[r][c]]["prob"] >= 750000)
                        mineBlock(c, r, "reset", 1);
                }
            }
        }
    }
    setTimeout(() => {
        resolve(true);
    }, 1000);
    });
}

function mineResetAid() {
    return new Promise((resolve) => {
    setTimeout(() => {
        mine = [[]];
        curX = 1000000000;
        let x = 1000000000;
        let y = curY;
        for (let r = y - 50; r < y + 50; r++) {
            if (r > -1 && mine[r] === undefined) mine[r] = [];
            for (let c = x - 50; c < x + 50; c++)
                if (mine[r] !== undefined)
                    mine[r][c] = "⬜";
        }
        checkAllAround(curX, curY, 1);
    }, 125);
    setTimeout(() => {
        resolve(true);
    }, 250);
    });
}