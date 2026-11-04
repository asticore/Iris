(window.IRIS_ICON_SETS = window.IRIS_ICON_SETS || {})["Arrows"] = ({
  "arrow-up-right": { l: "Arrow Up Right", t: "diagonal northeast ne upper right", s: [
    ["s", [22,78],[68,32]],
    ["f", [80,20],[80,52],[48,20],"z"]
  ] },
  "arrow-down-right": { l: "Arrow Down Right", t: "diagonal southeast se lower right", s: [
    ["s", [22,22],[68,68]],
    ["f", [80,80],[80,48],[48,80],"z"]
  ] },
  "arrow-up-left": { l: "Arrow Up Left", t: "diagonal northwest nw upper left", s: [
    ["s", [78,78],[32,32]],
    ["f", [20,20],[20,52],[52,20],"z"]
  ] },
  "arrow-down-left": { l: "Arrow Down Left", t: "diagonal southwest sw lower left", s: [
    ["s", [78,22],[32,68]],
    ["f", [20,80],[20,48],[52,80],"z"]
  ] },
  "arrows-left-right": { l: "Arrows Left Right", t: "horizontal swap both directions width", s: [
    ["s", [24,50],[76,50]],
    ["f", [14,50],[36,36],[36,64],"z"],
    ["f", [86,50],[64,36],[64,64],"z"]
  ] },
  "arrows-up-down": { l: "Arrows Up Down", t: "vertical swap both directions height", s: [
    ["s", [50,24],[50,76]],
    ["f", [50,14],[36,36],[64,36],"z"],
    ["f", [50,86],[36,64],[64,64],"z"]
  ] },
  "arrows-up-down-left-right": { l: "Arrows Up Down Left Right", t: "move drag four way pan reposition", s: [
    ["s", [50,20],[50,80]],
    ["s", [20,50],[80,50]],
    ["f", [50,12],[40,28],[60,28],"z"],
    ["f", [50,88],[40,72],[60,72],"z"],
    ["f", [12,50],[28,40],[28,60],"z"],
    ["f", [88,50],[72,40],[72,60],"z"]
  ] },
  "arrow-rotate-left": { l: "Arrow Rotate Left", t: "undo revert back counterclockwise reset", s: [
    ["s", ["arc",50,50,30,30,210,-90]],
    ["f", [32,20],[48,10],[48,30],"z"]
  ] },
  "arrow-rotate-right": { l: "Arrow Rotate Right", t: "redo forward clockwise reload turn", s: [
    ["s", ["arc",50,50,30,30,-30,270]],
    ["f", [68,20],[52,10],[52,30],"z"]
  ] },
  "arrows-rotate": { l: "Arrows Rotate", t: "refresh reload sync cycle update", s: [
    ["s", ["arc",50,50,30,30,-80,60]],
    ["s", ["arc",50,50,30,30,120,240]],
    ["f", [57,80],[72,81],[64,68],"z"],
    ["f", [43,20],[36,32],[28,19],"z"]
  ] },
  "chevron-left": { l: "Chevron Left", t: "previous back arrow less prev", s: [
    ["s", [62,22],[34,50],[62,78]]
  ] },
  "chevron-up": { l: "Chevron Up", t: "collapse top upward raise arrow", s: [
    ["s", [22,62],[50,34],[78,62]]
  ] },
  "chevron-down": { l: "Chevron Down", t: "expand dropdown more open arrow", s: [
    ["s", [22,38],[50,66],[78,38]]
  ] },
  "chevrons-left": { l: "Chevrons Left", t: "rewind first skip back double previous", s: [
    ["s", [52,22],[24,50],[52,78]],
    ["s", [78,22],[50,50],[78,78]]
  ] },
  "chevrons-right": { l: "Chevrons Right", t: "fast forward skip next double advance", s: [
    ["s", [48,22],[76,50],[48,78]],
    ["s", [22,22],[50,50],[22,78]]
  ] },
  "chevrons-up": { l: "Chevrons Up", t: "scroll top double upward jump", s: [
    ["s", [22,52],[50,24],[78,52]],
    ["s", [22,78],[50,50],[78,78]]
  ] },
  "chevrons-down": { l: "Chevrons Down", t: "scroll bottom double downward more", s: [
    ["s", [22,22],[50,50],[78,22]],
    ["s", [22,48],[50,76],[78,48]]
  ] },
  "angle-left": { l: "Angle Left", t: "bracket previous back less prev", s: [
    ["s", [58,30],[40,50],[58,70]]
  ] },
  "angle-right": { l: "Angle Right", t: "bracket next forward greater more", s: [
    ["s", [42,30],[60,50],[42,70]]
  ] },
  "caret-up": { l: "Caret Up", t: "triangle sort ascending top peak", s: [
    ["f", [50,30],[82,66],[18,66],"z"]
  ] },
  "caret-down": { l: "Caret Down", t: "triangle dropdown select descending menu", s: [
    ["f", [18,34],[82,34],[50,70],"z"]
  ] },
  "caret-left": { l: "Caret Left", t: "triangle previous back pointer", s: [
    ["f", [30,50],[66,18],[66,82],"z"]
  ] },
  "caret-right": { l: "Caret Right", t: "triangle next forward play pointer", s: [
    ["f", [70,50],[34,18],[34,82],"z"]
  ] },
  "circle-arrow-left": { l: "Circle Arrow Left", t: "back previous round button navigate", s: [
    ["c", 50,50,38,0],
    ["s", [66,50],[40,50]],
    ["f", [34,50],[46,38],[46,62],"z"]
  ] },
  "circle-arrow-right": { l: "Circle Arrow Right", t: "next forward round button navigate", s: [
    ["c", 50,50,38,0],
    ["s", [34,50],[60,50]],
    ["f", [66,50],[54,38],[54,62],"z"]
  ] },
  "circle-arrow-up": { l: "Circle Arrow Up", t: "top upload round button raise", s: [
    ["c", 50,50,38,0],
    ["s", [50,66],[50,40]],
    ["f", [50,32],[38,46],[62,46],"z"]
  ] },
  "circle-arrow-down": { l: "Circle Arrow Down", t: "download round button lower descend", s: [
    ["c", 50,50,38,0],
    ["s", [50,34],[50,60]],
    ["f", [50,68],[38,54],[62,54],"z"]
  ] },
  "arrow-turn-up": { l: "Arrow Turn Up", t: "level up enter return bend corner", s: [
    ["s", [18,64],[46,64],["arc",46,36,28,28,90,0]],
    ["f", [74,12],[62,36],[86,36],"z"]
  ] },
  "arrow-turn-down": { l: "Arrow Turn Down", t: "level down bend corner lower reverse", s: [
    ["s", [18,36],[46,36],["arc",46,64,28,28,270,360]],
    ["f", [74,88],[62,64],[86,64],"z"]
  ] },
  "share-arrow": { l: "Share Arrow", t: "export upload send out box publish", s: [
    ["s", [34,46],[24,46],[24,84],[76,84],[76,46],[66,46]],
    ["s", [50,60],[50,24]],
    ["f", [50,12],[38,30],[62,30],"z"]
  ] },
  "reply": { l: "Reply", t: "respond answer back message return", s: [
    ["s", [30,40],[60,40],["arc",60,62,22,22,270,360],[82,84]],
    ["f", [16,40],[34,26],[34,54],"z"]
  ] },
  "forward-arrow": { l: "Forward Arrow", t: "forward send redirect pass share next", s: [
    ["s", [70,40],[40,40],["arc",40,62,22,22,270,180],[18,84]],
    ["f", [84,40],[66,26],[66,54],"z"]
  ] },
  "shuffle": { l: "Shuffle", t: "random mix crossing swap randomize", s: [
    ["s", [18,32],[36,32],[64,68],[78,68]],
    ["s", [18,68],[36,68],[64,32],[78,32]],
    ["f", [86,32],[70,22],[70,42],"z"],
    ["f", [86,68],[70,58],[70,78],"z"]
  ] },
  "repeat": { l: "Repeat", t: "loop again cycle replay redo", s: [
    ["s", [22,56],[22,40],["arc",32,40,10,10,180,270],[68,30],["arc",68,40,10,10,270,360],[78,62]],
    ["f", [78,76],[68,62],[88,62],"z"],
    ["s", [70,74],[32,74],["arc",32,64,10,10,90,180],[22,56]]
  ] },
  "sort-up": { l: "Sort Up", t: "ascending order sort increasing ascend", s: [
    ["f", [50,18],[78,46],[22,46],"z"],
    ["s", [34,64],[66,64]],
    ["s", [34,78],[66,78]]
  ] },
  "sort-down": { l: "Sort Down", t: "descending order sort decreasing descend", s: [
    ["f", [50,82],[78,54],[22,54],"z"],
    ["s", [34,36],[66,36]],
    ["s", [34,22],[66,22]]
  ] },
  "expand": { l: "Expand", t: "enlarge grow outward fullscreen stretch", s: [
    ["s", [34,34],[18,18]],
    ["s", [66,66],[82,82]],
    ["s", [66,34],[82,18]],
    ["s", [34,66],[18,82]],
    ["f", [14,14],[14,36],[36,14],"z"],
    ["f", [86,86],[86,64],[64,86],"z"],
    ["f", [86,14],[64,14],[86,36],"z"],
    ["f", [14,86],[36,86],[14,64],"z"]
  ] },
  "compress": { l: "Compress", t: "shrink reduce inward collapse squeeze", s: [
    ["s", [16,16],[34,34]],
    ["s", [84,16],[66,34]],
    ["s", [84,84],[66,66]],
    ["s", [16,84],[34,66]],
    ["f", [44,44],[44,20],[20,44],"z"],
    ["f", [56,44],[56,20],[80,44],"z"],
    ["f", [56,56],[56,80],[80,56],"z"],
    ["f", [44,56],[44,80],[20,56],"z"]
  ] },
  "maximize": { l: "Maximize", t: "fullscreen enlarge widen full window", s: [
    ["s", [18,40],[18,18],[40,18]],
    ["s", [60,18],[82,18],[82,40]],
    ["s", [82,60],[82,82],[60,82]],
    ["s", [40,82],[18,82],[18,60]]
  ] },
  "minimize": { l: "Minimize", t: "shrink reduce smaller restore exit window", s: [
    ["s", [40,18],[40,40],[18,40]],
    ["s", [60,18],[60,40],[82,40]],
    ["s", [82,60],[60,60],[60,82]],
    ["s", [18,60],[40,60],[40,82]]
  ] },
  "down-left-and-up-right-to-center": { l: "Down Left And Up Right To Center", t: "compress converge gather inward meet center", s: [
    ["s", [16,84],[34,66]],
    ["s", [84,16],[66,34]],
    ["f", [44,56],[44,80],[20,56],"z"],
    ["f", [56,44],[56,20],[80,44],"z"]
  ] },
  "turn-left": { l: "Turn Left", t: "bend corner left return curve redirect", s: [
    ["s", [64,82],[64,54],["arc",36,54,28,28,0,-90]],
    ["f", [12,26],[36,38],[36,14],"z"]
  ] },
  "turn-right": { l: "Turn Right", t: "bend corner right return curve redirect", s: [
    ["s", [36,82],[36,54],["arc",64,54,28,28,180,270]],
    ["f", [88,26],[64,38],[64,14],"z"]
  ] },
  "location-arrow": { l: "Location Arrow", t: "navigate gps pointer direction compass", s: [
    ["s", [50,14],[82,84],[50,68],[18,84],"z"]
  ] },
  "arrow-trend-up": { l: "Arrow Trend Up", t: "growth increase rising chart stats profit", s: [
    ["s", [16,72],[40,48],[56,62],[74,32]],
    ["f", [84,22],[84,50],[56,22],"z"]
  ] },
  "arrow-trend-down": { l: "Arrow Trend Down", t: "decline decrease falling chart stats loss", s: [
    ["s", [16,28],[40,52],[56,38],[74,68]],
    ["f", [84,78],[84,50],[56,78],"z"]
  ] },
  "right-left": { l: "Right Left", t: "swap exchange trade opposite both ways", s: [
    ["s", [22,36],[74,36]],
    ["f", [86,36],[70,26],[70,46],"z"],
    ["s", [78,64],[26,64]],
    ["f", [14,64],[30,54],[30,74],"z"]
  ] },
  "right-to-bracket": { l: "Right To Bracket", t: "sign in login enter access log in door", s: [
    ["s", [52,22],[76,22],[76,78],[52,78]],
    ["s", [18,50],[60,50]],
    ["f", [70,50],[54,38],[54,62],"z"]
  ] }
});
