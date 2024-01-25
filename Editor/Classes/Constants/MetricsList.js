const StatState = {
    GOOD: 'GOOD',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}

const metricsList = [
    ["Number of frames", 800, 1000, 1300, 1500],
    ["On average forks", 11, 13, 15, 16],
    ["Text in a row", 0, 0, 3, 4],
    ["Paid options", 4, 4, Number.MAX_VALUE, Number.MAX_VALUE],
    ["Luck change", 1, 1, 2, Number.MAX_VALUE],
    ["Luck check", 0, 0, 2, 3],
    ["Dressing up", 1, 2, Number.MAX_VALUE, Number.MAX_VALUE],
    ["Satyr Love", 0, 1, Number.MAX_VALUE, Number.MAX_VALUE],
    ["Levet Love", 0, 1, Number.MAX_VALUE, Number.MAX_VALUE],
    ["Psychological choice", 1, 1, 3, Number.MAX_VALUE],
    ["Mother moon", 1, 1, 1, Number.MAX_VALUE],
    ["Number of letters", 0, 0, 175, 190],
    ["Number of locations", 6, 9, 11, 13],
];

const errorsList = [
    ["There are an unexpected number of options to choose from", StatState.ERROR],
    ["Not enough psychological stuff", StatState.ERROR],
    ["Extra frame", StatState.WARNING],
    ["Text is too long", StatState.WARNING],
    ["Unexpected frame type", StatState.ERROR],
    ["Unexpected frame property", StatState.ERROR],
];