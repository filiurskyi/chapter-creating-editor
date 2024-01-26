const StatState = {
    GOOD: 'GOOD',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}

const metricsList = [
    ["Number of frames", 800, 1000, 1300, 1500, false],// 0
    ["On average forks", 11, 13, 15, 16, false],// 1
    ["Text in a row", 0, 0, 3, 4, true],// 2
    ["Paid options", 4, 4, Number.MAX_VALUE, Number.MAX_VALUE, false],// 3
    ["Luck change", 1, 1, 2, Number.MAX_VALUE, false],// 4
    ["Luck check", 0, 0, 2, 3, false],// 5
    ["Dressing up", 1, 2, Number.MAX_VALUE, Number.MAX_VALUE, false],// 6
    ["Satyr Love", 0, 1, Number.MAX_VALUE, Number.MAX_VALUE, false],// 7
    ["Levet Love", 0, 1, Number.MAX_VALUE, Number.MAX_VALUE, false],// 8
    ["Psychological choice", 1, 1, 3, Number.MAX_VALUE, false],// 9
    ["Mother moon", 1, 1, 1, Number.MAX_VALUE, false],// 10
    ["Number of letters", 0, 0, 175, 190, true],// 11
    ["Number of locations", 6, 9, 11, 13, false],// 12
];

const errorsList = [
    ["Not enough psychological stuff", StatState.ERROR],// 0
    ["Extra frame", StatState.WARNING],// 1
    ["Text is too long", StatState.WARNING],// 2
    ["Unexpected frame type", StatState.ERROR],// 3
    ["Unexpected frame property", StatState.ERROR],// 4
    ["Unexpected psychological Choice formatting", StatState.ERROR],// 5
    ["Choice variant should lead somewhere", StatState.WARNING],// 6
    ["Choice frame must lead to Option frame", StatState.ERROR],// 7
    ["Unexpected frame formatting", StatState.ERROR],// 8
    ["Disconnected frame", StatState.ERROR],// 9
];