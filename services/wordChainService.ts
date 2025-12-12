import { WordChainTurn } from "../types";

// --- SIMULATED OXFORD DICTIONARY DATASET (Subset for Demo) ---
// In a production app, this would be a JSON file loaded on demand or a proper database.

const BOT_VOCABULARY: Record<string, string> = {
  // A
  "APPLE": "A round fruit with red or green skin and a white inside.",
  "ANT": "A small insect that lives in highly organized groups.",
  "ACTOR": "A person whose profession is acting on the stage, in movies, or on television.",
  "ABOVE": "In extended space over and not touching.",
  "ANGRY": "Having a strong feeling of or showing annoyance, displeasure, or hostility.",
  "AWAKE": "Not asleep.",
  "AREA": "A region or part of a town, a country, or the world.",
  "ANIMAL": "A living organism that feeds on organic matter.",
  // B
  "BALL": "A solid or hollow spherical or egg-shaped object that is kicked, thrown, or hit in a game.",
  "BAT": "A mammal that flies at night; also a club used to hit a ball.",
  "BEAR": "A large, heavy mammal that walks on the soles of its feet.",
  "BEST": "Of the most excellent, effective, or desirable type or quality.",
  "BOAT": "A small vessel for traveling over water.",
  "BLUE": "The color between green and violet, like the clear sky.",
  "BRAVE": "Ready to face and endure danger or pain; showing courage.",
  "BREAD": "Food made of flour, water, and yeast or another leavening agent, mixed together and baked.",
  // C
  "CAT": "A small domesticated carnivorous mammal with soft fur.",
  "CAR": "A road vehicle, typically with four wheels, powered by an engine.",
  "COLD": "Of or at a low or relatively low temperature.",
  "COME": "Move or travel toward or into a place thought of as near or familiar.",
  "CITY": "A large town.",
  "CAKE": "An item of soft, sweet food made from a mixture of flour, shortening, eggs, sugar.",
  "CHAIR": "A separate seat for one person, typically with a back and four legs.",
  // D
  "DOG": "A domesticated carnivorous mammal that typically has a long snout and barking voice.",
  "DOOR": "A hinged, sliding, or revolving barrier at the entrance to a building or room.",
  "DARK": "With little or no light.",
  "DESK": "A piece of furniture with a flat or sloped surface and typically with drawers.",
  "DEEP": "Extending far down from the top or surface.",
  "DATE": "The day of the month or year as specified by a number.",
  "DREAM": "A series of thoughts, images, and sensations occurring in a person's mind during sleep.",
  // E
  "EGG": "An oval or round object laid by a female bird, reptile, fish, or invertebrate.",
  "EAT": "Put (food) into the mouth and chew and swallow it.",
  "EARLY": "Happening or done before the usual or expected time.",
  "EAGLE": "A large bird of prey with a massive hooked bill and long broad wings.",
  "END": "A final part of something, especially a period of time, an activity, or a story.",
  "EAST": "The direction where the sun rises.",
  "ELEPHANT": "A heavy plant-eating mammal with a trunk, long curved ivory tusks, and large ears.",
  // F
  "FISH": "A limbless cold-blooded vertebrate animal with gills and fins and living wholly in water.",
  "FAST": "Moving or capable of moving at high speed.",
  "FIRE": "Combustion or burning, in which substances combine chemically with oxygen.",
  "FIVE": "Equivalent to the sum of two and three; one more than four.",
  "FOOD": "Any nutritious substance that people or animals eat or drink.",
  "FREE": "Not under the control or in the power of another; able to act or be done as one wishes.",
  "FRIEND": "A person whom one knows and with whom one has a bond of mutual affection.",
  // G
  "GOAT": "A hardy domesticated ruminant animal that has backward curving horns.",
  "GOLD": "A yellow precious metal, the chemical element of atomic number 79.",
  "GAME": "A form of play or sport, especially a competitive one played according to rules.",
  "GOOD": "To be desired or approved of.",
  "GREEN": "The color between blue and yellow in the spectrum; colored like grass.",
  "GIRL": "A female child or adolescent.",
  "GHOST": "An apparition of a dead person that is believed to appear or become manifest to the living.",
  // H
  "HAT": "A shaped covering for the head worn for warmth, as a fashion item, or as part of a uniform.",
  "HOT": "Having a high degree of heat or a high temperature.",
  "HOME": "The place where one lives permanently, especially as a member of a family or household.",
  "HAND": "The end part of a person's arm beyond the wrist, including the palm, fingers, and thumb.",
  "HIGH": "Of great vertical extent.",
  "HAPPY": "Feeling or showing pleasure or contentment.",
  "HOUSE": "A building for human habitation, especially one that is lived in by a family or small group of people.",
  // I
  "ICE": "Frozen water, a brittle, transparent crystalline solid.",
  "IDEA": "A thought or suggestion as to a possible course of action.",
  "IRON": "A strong, hard magnetic silver-gray metal.",
  "INTO": "Expressing movement or action with the result that someone or something becomes enclosed or surrounded by something else.",
  "INK": "A colored fluid used for writing, drawing, printing, or duplicating.",
  "ISLAND": "A piece of land surrounded by water.",
  "IGLOO": "A dome-shaped Eskimo house, typically built from blocks of solid snow.",
  // J
  "JAR": "A wide-mouthed, cylindrical container made of glass or pottery.",
  "JOB": "A paid position of regular employment.",
  "JUMP": "Push oneself off a surface and into the air by using the muscles in one's legs and feet.",
  "JUST": "Based on or behaving according to what is morally right and fair.",
  "JOKE": "A thing that someone says to cause amusement or laughter.",
  "JOY": "A feeling of great pleasure and happiness.",
  "JUNGLE": "An area of land overgrown with dense forest and tangled vegetation, typically in the tropics.",
  // K
  "KEY": "A small piece of shaped metal with incisions cut to fit the wards of a particular lock.",
  "KITE": "A toy consisting of a light frame with thin material stretched over it, flown in the wind.",
  "KING": "The male ruler of an independent state, especially one who inherits the position by right of birth.",
  "KIND": "A group of people or things having similar characteristics.",
  "KEEP": "Have or retain possession of.",
  "KNOW": "Be aware of through observation, inquiry, or information.",
  "KANGAROO": "A large plant-eating marsupial with a long powerful tail and strongly developed hindlegs.",
  // L
  "LION": "A large cat that lives in prides, found in Africa and NW India.",
  "LAMP": "A device for giving light, either one consisting of an electric bulb together with its holder and shade or cover.",
  "LONG": "Measuring a great distance from end to end.",
  "LATE": "Doing something or taking place after the expected, proper, or usual time.",
  "LOVE": "An intense feeling of deep affection.",
  "LAKE": "A large body of water surrounded by land.",
  "LEMON": "A yellow, oval citrus fruit with thick skin and fragrant, acidic juice.",
  // M
  "MOON": "The natural satellite of the earth, visible (chiefly at night) by reflected light from the sun.",
  "MAP": "A diagrammatic representation of an area of land or sea showing physical features, cities, roads, etc.",
  "MILK": "An opaque white fluid rich in fat and protein, secreted by female mammals for the nourishment of their young.",
  "MAN": "An adult human male.",
  "MAKE": "Form (something) by putting parts together or combining substances; construct; create.",
  "MOUSE": "A small rodent that typically has a pointed snout, relatively large ears and eyes, and a long tail.",
  "MONKEY": "A small to medium-sized primate that typically has a long tail, most kinds of which live in trees.",
  // N
  "NET": "A piece of open-meshed material made of twine, cord, or rope used to catch things.",
  "NINE": "Equivalent to the product of three and three; one more than eight.",
  "NIGHT": "The period of darkness in each twenty-four hours; the time from sunset to sunrise.",
  "NOSE": "The part projecting above the mouth on the face of a person or animal.",
  "NEW": "Not existing before; made, introduced, or discovered recently or now for the first time.",
  "NAME": "A word or set of words by which a person, animal, place, or thing is known, addressed, or referred to.",
  "NEST": "A structure or place made or chosen by a bird for laying eggs and sheltering its young.",
  // O
  "OWL": "A nocturnal bird of prey with large forward-facing eyes.",
  "OLD": "Having lived for a long time; no longer young.",
  "ONE": "The lowest cardinal number; half of two.",
  "OPEN": "Allowing access, passage, or a view through an empty space; not closed or blocked.",
  "ORANGE": "A round juicy citrus fruit with a tough bright reddish-yellow rind.",
  "OCEAN": "A very large expanse of sea, in particular each of the main areas into which the sea is divided.",
  "ONION": "An edible bulb with a pungent taste and smell, composed of several concentric layers.",
  // P
  "PEN": "An instrument for writing or drawing with ink.",
  "PIG": "An omnivorous domesticated hoofed mammal with sparse bristly hair and a flat snout.",
  "PARK": "A large public green area in a town, used for recreation.",
  "PLAY": "Engage in activity for enjoyment and recreation rather than a serious or practical purpose.",
  "PINK": "Of a color intermediate between red and white, as of coral or salmon.",
  "PAPER": "Material manufactured in thin sheets from the pulp of wood or other fibrous substances.",
  "PIZZA": "A dish of Italian origin consisting of a flat, round base of dough baked with a topping of tomato sauce and cheese.",
  // Q
  "QUEEN": "The female ruler of an independent state, especially one who inherits the position by right of birth.",
  "QUIET": "Making little or no noise.",
  "QUICK": "Moving fast or doing something in a short time.",
  "QUACK": "The characteristic harsh sound made by a duck.",
  "QUEST": "A long or arduous search for something.",
  "QUOTE": "Repeat or copy out (a group of words from a text or speech).",
  "QUESTION": "A sentence worded or expressed so as to elicit information.",
  // R
  "RED": "The color at the end of the spectrum next to orange and opposite violet, as of blood, fire, or rubies.",
  "RUN": "Move at a speed faster than a walk, never having both or all the feet on the ground at the same time.",
  "RAT": "A rodent that resembles a large mouse.",
  "RAIN": "Moisture condensed from the atmosphere that falls visibly in separate drops.",
  "ROAD": "A wide way leading from one place to another, especially one with a specially prepared surface.",
  "RICH": "Having a great deal of money or assets; wealthy.",
  "RABBIT": "A burrowing, gregarious, plant-eating mammal with long ears, long hind legs, and a short tail.",
  // S
  "SUN": "The star around which the earth orbits.",
  "STAR": "A fixed luminous point in the night sky that is a large, remote incandescent body like the sun.",
  "SEA": "The expanse of salt water that covers most of the earth's surface and surrounds its landmasses.",
  "SIT": "Adopt or be in a position in which one's weight is supported by one's buttocks rather than one's feet and one's back is upright.",
  "SIX": "Equivalent to the product of two and three; one more than five.",
  "SNAKE": "A long limbless reptile that has no eyelids, a short tail, and jaws that are capable of considerable extension.",
  "SCHOOL": "An institution for educating children.",
  // T
  "TREE": "A woody perennial plant, typically having a single stem or trunk growing to a considerable height.",
  "TEN": "Equivalent to the product of two and five; one more than nine.",
  "TOY": "An object for a child to play with, typically a model or miniature replica of something.",
  "TIME": "The indefinite continued progress of existence and events in the past, present, and future.",
  "TEA": "A hot drink made by infusing the dried crushed leaves of the tea plant in boiling water.",
  "TIGER": "A very large solitary cat with a yellow-brown coat striped with black.",
  "TABLE": "A piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed.",
  // U
  "USE": "Take, hold, or deploy (something) as a means of accomplishing a purpose or achieving a result.",
  "UNDER": "Extending or directly below.",
  "UGLY": "Unpleasant or repulsive, especially in appearance.",
  "UNIT": "An individual thing or person regarded as single and complete.",
  "UNCLE": "The brother of one's father or mother or the husband of one's aunt.",
  "URN": "A tall, rounded vase with a base, and often a stem, especially one used for storing the ashes of a cremated person.",
  "UMBRELLA": "A device consisting of a circular canopy of cloth on a folding metal frame, used as protection against rain or sun.",
  // V
  "VAN": "A medium-sized motor vehicle, typically without side windows in the rear part.",
  "VERY": "In a high degree.",
  "VASE": "A decorative container, typically made of glass or china and used as an ornament or for displaying cut flowers.",
  "VIEW": "The ability to see something or to be seen from a particular position.",
  "VOTE": "A formal indication of a choice between two or more candidates or courses of action.",
  "VOICE": "The sound produced in a person's larynx and uttered through the mouth, as speech or song.",
  "VIOLIN": "A stringed musical instrument of treble pitch, played with a horsehair bow.",
  // W
  "WATER": "A colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain.",
  "WIND": "The perceptible natural movement of the air.",
  "WORK": "Activity involving mental or physical effort done in order to achieve a purpose or result.",
  "WALK": "Move at a regular pace by lifting and setting down each foot in turn.",
  "WHITE": "Of the color of milk or fresh snow.",
  "WOLF": "A wild carnivorous mammal of the dog family, living and hunting in packs.",
  "WORLD": "The earth, together with all of its countries, peoples, and natural features.",
  // X
  "XYLOPHONE": "A musical instrument played by striking a row of wooden bars of graduated length with one or more small wooden or plastic mallets.",
  "XRAY": "An electromagnetic wave of high energy and very short wavelength.",
  // Y
  "YELLOW": "The color between green and orange in the spectrum, a primary subtractive color complementary to blue.",
  "YES": "Used to give an affirmative response.",
  "YEAR": "The time taken by a planet to make one revolution around the sun.",
  "YOU": "Used to refer to the person or people that the speaker is addressing.",
  "YOUNG": "Having lived or existed for only a short time.",
  "YARD": "A unit of linear measure equal to 3 feet (0.9144 meter).",
  "YACHT": "A medium-sized sailing boat equipped for cruising or racing.",
  // Z
  "ZOO": "An establishment that maintains a collection of wild animals, typically in a park or gardens, for study, conservation, or display to the public.",
  "ZERO": "No quantity or number; naught; the figure 0.",
  "ZEBRA": "An African wild horse with black-and-white stripes and an erect mane.",
  "ZONE": "An area or stretch of land having a particular characteristic, purpose, or use.",
  "ZINC": "The chemical element of atomic number 30, a silvery-white metal that is a constituent of brass.",
  "ZIPPER": "A device for fastening clothing or bags, consisting of two toothed tracks that are joined by a slider."
};

// Expanded validation list to prevent unfair "Word not found" errors
const COMMON_ENGLISH_WORDS = new Set([
  ...Object.keys(BOT_VOCABULARY),
  // Common 1-3 letter words
  "A", "AN", "AS", "AT", "BE", "BY", "DO", "GO", "HE", "HI", "IF", "IN", "IS", "IT", "ME", "MY", "NO", "OF", "OH", "OK", "ON", "OR", "SO", "TO", "UP", "US", "WE",
  "ACT", "ADD", "AGE", "AGO", "AID", "AIM", "AIR", "ALL", "AND", "ANY", "APE", "ARM", "ART", "ASH", "ASK", "ATE", "BAD", "BAG", "BAN", "BAR", "BED", "BEE", "BET", "BID", "BIG", "BIN", "BIT", "BOX", "BOY", "BUD", "BUG", "BUS", "BUY", "CAN", "CAP", "CAT", "COW", "CRY", "CUP", "CUT", "DAD", "DAY", "DIE", "DIG", "DIM", "DIP", "DOG", "DOT", "DRY", "DUE", "EAR", "EAT", "EGG", "EGO", "ELF", "ELK", "END", "ERA", "EVE", "EYE", "FAN", "FAR", "FAT", "FED", "FEW", "FIG", "FIN", "FIT", "FLY", "FOG", "FOR", "FOX", "FRY", "FUN", "FUR", "GAP", "GAS", "GEM", "GET", "GIG", "GIN", "GOD", "GOT", "GUM", "GUN", "GUT", "GUY", "GYM", "HAD", "HAM", "HAS", "HAT", "HAY", "HEN", "HER", "HEY", "HID", "HIM", "HIP", "HIT", "HOG", "HOP", "HOT", "HOW", "HUB", "HUG", "HUM", "HUT", "ICE", "ILL", "INK", "INN", "ION", "ITS", "IVY", "JAM", "JAR", "JAW", "JET", "JOB", "JOG", "JOY", "KEY", "KID", "KIN", "KIT", "LAB", "LAD", "LAP", "LAW", "LAY", "LEG", "LET", "LID", "LIE", "LIP", "LIT", "LOG", "LOT", "LOW", "MAD", "MAN", "MAP", "MAT", "MAY", "MEN", "MET", "MIX", "MOM", "MOP", "MUD", "MUG", "NAP", "NET", "NEW", "NIL", "NOD", "NOR", "NOT", "NOW", "NUT", "OAK", "ODD", "OFF", "OIL", "OLD", "ONE", "OPT", "ORE", "OUR", "OUT", "OWL", "OWN", "PAD", "PAN", "PAR", "PAT", "PAW", "PAY", "PEA", "PEN", "PET", "PIE", "PIG", "PIN", "PIT", "POD", "POP", "POT", "PRO", "PUT", "RAG", "RAM", "RAN", "RAP", "RAT", "RAW", "RED", "RIB", "RID", "RIG", "RIM", "RIP", "ROB", "ROD", "ROT", "ROW", "RUB", "RUG", "RUN", "SAD", "SAG", "SAT", "SAW", "SAY", "SEA", "SEE", "SET", "SEW", "SEX", "SHE", "SHY", "SIN", "SIP", "SIR", "SIT", "SIX", "SKI", "SKY", "SLY", "SON", "SOW", "SOY", "SPA", "SPY", "SUM", "SUN", "TAB", "TAG", "TAN", "TAP", "TAR", "TAX", "TEA", "TEN", "THE", "TIE", "TIN", "TIP", "TOE", "TON", "TOO", "TOP", "TOW", "TOY", "TRY", "TUB", "TUG", "TWO", "URN", "USE", "VAN", "VET", "VIA", "VOW", "WAR", "WAX", "WAY", "WEB", "WED", "WET", "WHO", "WHY", "WIG", "WIN", "WIT", "WOE", "WON", "WOW", "YES", "YET", "YOU", "ZIP", "ZOO",
  // Common Verbs, Nouns, Adjectives (4+ letters)
  "ABLE", "ABOUT", "ABOVE", "ACCEPT", "ACCORD", "ACROSS", "ACTUAL", "ADMIT", "ADOPT", "ADULT", "AFFECT", "AFRAID", "AGAIN", "AGENCY", "AGENT", "AGREE", "AHEAD", "ALLOW", "ALONE", "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANIMAL", "ANNUAL", "ANSWER", "APPEAR", "APPLE", "APPLY", "AREA", "ARGUE", "ARISE", "ARMED", "ARMY", "ARRIVE", "ASLEEP", "ASSET", "ASSUME", "ATTACK", "ATTEND", "AUDIT", "AUTHOR", "AVOID", "AWAKE", "AWARD", "AWARE", "AWAY", "BABY", "BACK", "BAKE", "BALL", "BANK", "BASE", "BASIC", "BASIS", "BATH", "BATTLE", "BEACH", "BEAR", "BEAT", "BEAUTY", "BECOME", "BEDROOM", "BEER", "BEFORE", "BEGIN", "BEHALF", "BEHAVE", "BEHIND", "BELIEF", "BELONG", "BELOW", "BELT", "BENCH", "BEND", "BEST", "BETTER", "BEYOND", "BILL", "BIND", "BIRD", "BIRTH", "BLACK", "BLAME", "BLIND", "BLOCK", "BLOOD", "BLOW", "BLUE", "BOARD", "BOAT", "BODY", "BOND", "BONE", "BOOK", "BOOM", "BOOT", "BORDER", "BORN", "BOSS", "BOTH", "BOTHER", "BOTTLE", "BOTTOM", "BOWL", "BRAIN", "BRANCH", "BRAND", "BRAVE", "BREAD", "BREAK", "BREATH", "BRICK", "BRIDGE", "BRIEF", "BRIGHT", "BRING", "BROAD", "BROWN", "BRUSH", "BUCK", "BUILD", "BUNCH", "BURN", "BURST", "BURY", "BUSH", "BUSY", "BUTTON", "BUYER", "CABIN", "CABLE", "CAKE", "CALL", "CALM", "CAMERA", "CAMP", "CANAL", "CANDID", "CANDLE", "CANDY", "CANVAS", "CAPABLE", "CAPITAL", "CARD", "CARE", "CAREER", "CARPET", "CARRY", "CASE", "CASH", "CAST", "CATCH", "CAUSE", "CEILING", "CELL", "CENTER", "CHAIN", "CHAIR", "CHANCE", "CHANGE", "CHANNEL", "CHARGE", "CHART", "CHEAP", "CHECK", "CHEEK", "CHEESE", "CHEST", "CHICKEN", "CHIEF", "CHILD", "CHOICE", "CHOOSE", "CHURCH", "CIGAR", "CIRCLE", "CITY", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIENT", "CLIMB", "CLOCK", "CLOSE", "CLOTH", "CLOUD", "CLUB", "COACH", "COAL", "COAST", "COAT", "CODE", "COFFEE", "COLD", "COLLAR", "COLOR", "COLUMN", "COMB", "COMBINE", "COME", "COMFORT", "COMMIT", "COMMON", "COMPANY", "COMPLEX", "CONCEPT", "CONCERN", "CONDUCT", "CONFIRM", "CONNECT", "CONSIST", "CONTACT", "CONTAIN", "CONTENT", "CONTEST", "CONTEXT", "CONTROL", "COOK", "COOL", "COPY", "CORN", "CORNER", "COST", "COTTON", "COULD", "COUNCIL", "COUNT", "COUNTRY", "COUNTY", "COUPLE", "COURAGE", "COURSE", "COURT", "COUSIN", "COVER", "CRACK", "CRAFT", "CRASH", "CRAZY", "CREAM", "CREATE", "CREDIT", "CREW", "CRIME", "CRISIS", "CRITIC", "CROSS", "CROWD", "CROWN", "CRUEL", "CRUSH", "CULTURE", "CURING", "CURLY", "CURRENT", "CURVE", "CUSTOM", "CYCLE", "DAILY", "DAMAGE", "DANCE", "DANGER", "DARE", "DARK", "DATA", "DATE", "DEAD", "DEAL", "DEAR", "DEATH", "DEBATE", "DEBT", "DECADE", "DECAY", "DECENT", "DECIDE", "DECK", "DECLARE", "DECLINE", "DEEP", "DEFEAT", "DEFEND", "DEFINE", "DEGREE", "DELAY", "DEMAND", "DENIAL", "DEPEND", "DEPTH", "DEPUTY", "DERIVE", "DESCRIBE", "DESERT", "DESIGN", "DESIRE", "DESK", "DETAIL", "DETECT", "DEVICE", "DEVOTE", "DIET", "DIFFER", "DIGITAL", "DINNER", "DIRECT", "DIRTY", "DISCUSS", "DISEASE", "DISH", "DISPLAY", "DISTANT", "DIVIDE", "DOCTOR", "DOLLAR", "DOMAIN", "DOOR", "DOUBLE", "DOUBT", "DOWN", "DRAFT", "DRAG", "DRAMA", "DRAW", "DRAWER", "DREAM", "DRESS", "DRINK", "DRIVE", "DRIVER", "DROP", "DRUG", "DRUM", "DUST", "DUTY", "EACH", "EAGER", "EARLY", "EARN", "EARTH", "EASE", "EAST", "EASY", "EDGE", "EDITOR", "EDUCATE", "EFFECT", "EFFORT", "EIGHT", "EITHER", "ELBOW", "ELDER", "ELECT", "ELEMENT", "ELEVEN", "ELSE", "EMAIL", "EMERGE", "EMPIRE", "EMPLOY", "EMPTY", "ENABLE", "ENDING", "ENERGY", "ENGINE", "ENJOY", "ENOUGH", "ENSURE", "ENTER", "ENTIRE", "ENTRY", "ENVY", "EQUAL", "EQUIP", "ESCAPE", "ESTATE", "ETHNIC", "EVENT", "EVER", "EVERY", "EVIL", "EXACT", "EXAM", "EXAMPLE", "EXCEED", "EXCEPT", "EXCITE", "EXCUSE", "EXECUTE", "EXIST", "EXPAND", "EXPECT", "EXPERT", "EXPORT", "EXTEND", "EXTENT", "EXTRA", "EXTREME", "FACE", "FACT", "FACTOR", "FADE", "FAIL", "FAINT", "FAIR", "FAITH", "FALL", "FALSE", "FAME", "FAMILY", "FANCY", "FARM", "FARMER", "FASHION", "FAST", "FATAL", "FATHER", "FAULT", "FAVOR", "FEAR", "FEATHER", "FEATURE", "FEDERAL", "FEED", "FEEL", "FELLOW", "FEMALE", "FENCE", "FIBER", "FICTION", "FIELD", "FIFTY", "FIGHT", "FIGURE", "FILE", "FILL", "FILM", "FINAL", "FINANCE", "FIND", "FINE", "FINGER", "FINISH", "FIRE", "FIRM", "FIRST", "FISH", "FIST", "FIVE", "FLAG", "FLAME", "FLASH", "FLAT", "FLAVOR", "FLESH", "FLIGHT", "FLOAT", "FLOOR", "FLOUR", "FLOW", "FLOWER", "FLUID", "FLYING", "FOCUS", "FOLD", "FOLK", "FOLLOW", "FOOD", "FOOL", "FOOT", "FORCE", "FOREST", "FORGET", "FORM", "FORMAL", "FORTUNE", "FORWARD", "FOUND", "FRAME", "FREE", "FREEZE", "FRESH", "FRIEND", "FRIGHT", "FROG", "FROM", "FRONT", "FROZEN", "FRUIT", "FUEL", "FULL", "FULLY", "FUND", "FUNNY", "FUTURE", "GAIN", "GAME", "GARDEN", "GATE", "GATHER", "GEAR", "GENDER", "GENERAL", "GENTLE", "GIFT", "GIRL", "GIVE", "GLAD", "GLANCE", "GLASS", "GLOBAL", "GLOVE", "GOAL", "GOAT", "GOLD", "GOLDEN", "GOLF", "GOOD", "GOVERN", "GRAB", "GRADE", "GRAND", "GRANT", "GRASS", "GRAVE", "GRAY", "GREAT", "GREEN", "GREET", "GREY", "GRIND", "GRIP", "GROSS", "GROUND", "GROUP", "GROW", "GROWTH", "GUARD", "GUESS", "GUEST", "GUIDE", "GUILT", "GUITAR", "HABIT", "HAIR", "HALF", "HALL", "HAND", "HANDLE", "HANG", "HAPPEN", "HAPPY", "HARD", "HARM", "HATE", "HAVE", "HEAD", "HEALTH", "HEAR", "HEART", "HEAT", "HEAVY", "HEEL", "HEIGHT", "HELLO", "HELP", "HENCE", "HERE", "HERO", "HIDE", "HIGH", "HILL", "HIRE", "HISTORY", "HOLD", "HOLE", "HOLIDAY", "HOLLOW", "HOLY", "HOME", "HONEST", "HONOR", "HOOK", "HOPE", "HORN", "HORROR", "HORSE", "HOSPITAL", "HOST", "HOTEL", "HOUR", "HOUSE", "HUGE", "HUMAN", "HUMOR", "HUNDRED", "HUNT", "HURRY", "HURT", "HUSBAND", "IDEA", "IDEAL", "IGNORE", "IMAGE", "IMAGINE", "IMPACT", "IMPORT", "IMPRESS", "INCH", "INCLUDE", "INCOME", "INDEED", "INDEX", "INDOOR", "INFANT", "INFORM", "INJURY", "INNER", "INPUT", "INSECT", "INSIDE", "INSIST", "INSTALL", "INSTEAD", "INTEND", "INTENT", "INVEST", "INVITE", "IRON", "ISLAND", "ISSUE", "ITEM", "JACKET", "JAIL", "JEANS", "JEWEL", "JOIN", "JOINT", "JOKE", "JOURNAL", "JOURNEY", "JUDGE", "JUICE", "JUMP", "JUNIOR", "JURY", "JUST", "KEEP", "KETTLE", "KICK", "KILL", "KIND", "KING", "KISS", "KITCHEN", "KNEE", "KNIFE", "KNOCK", "KNOW", "LABEL", "LABOR", "LACK", "LADDER", "LADY", "LAKE", "LAMP", "LAND", "LANE", "LARGE", "LASER", "LAST", "LATE", "LATELY", "LATER", "LAUGH", "LAUNCH", "LAWYER", "LAYER", "LEAD", "LEADER", "LEAF", "LEAGUE", "LEAN", "LEARN", "LEAST", "LEATHER", "LEAVE", "LECTURE", "LEFT", "LEGAL", "LEMON", "LEND", "LENGTH", "LESS", "LESSON", "LETTER", "LEVEL", "LIBERAL", "LIBRARY", "LICENSE", "LICK", "LIFE", "LIFT", "LIGHT", "LIKE", "LIMB", "LIMIT", "LINE", "LINK", "LION", "LIQUID", "LIST", "LISTEN", "LITTLE", "LIVE", "LOAD", "LOAN", "LOCAL", "LOCATE", "LOCK", "LOGIC", "LONELY", "LONG", "LOOK", "LOOSE", "LORD", "LOSE", "LOSS", "LOST", "LOUD", "LOVE", "LOVELY", "LOVER", "LOWER", "LOYAL", "LUCK", "LUCKY", "LUNCH", "LUNG", "LUXURY", "MACHINE", "MADAM", "MAIL", "MAIN", "MAINTAIN", "MAJOR", "MAKE", "MALE", "MALL", "MANAGE", "MANNERS", "MANY", "MAPLE", "MARCH", "MARGIN", "MARK", "MARKET", "MARRY", "MASS", "MASTER", "MATCH", "MATE", "MATTER", "MAXIMUM", "MAYBE", "MAYOR", "MEAL", "MEAN", "MEANT", "MEASURE", "MEAT", "MEDIA", "MEDICAL", "MEDIUM", "MEET", "MELT", "MEMBER", "MEMORY", "MENTAL", "MENTION", "MERELY", "MERIT", "MESS", "METAL", "METER", "METHOD", "MIDDLE", "MIDNIGHT", "MIGHT", "MILD", "MILE", "MILITARY", "MILK", "MILLION", "MIND", "MINE", "MINER", "MINOR", "MINUTE", "MIRROR", "MISS", "MISSION", "MISTAKE", "MIXED", "MIXTURE", "MOBILE", "MODEL", "MODERN", "MODEST", "MOMENT", "MONEY", "MONITOR", "MONTH", "MOOD", "MOON", "MORAL", "MORE", "MORNING", "MOST", "MOTHER", "MOTION", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVE", "MOVIE", "MUCH", "MUDDY", "MURDER", "MUSCLE", "MUSEUM", "MUSIC", "MUST", "MYSELF", "NAIL", "NAKED", "NAME", "NARROW", "NASTY", "NATION", "NATIVE", "NATURAL", "NATURE", "NAVY", "NEAR", "NEAT", "NECK", "NEED", "NEEDLE", "NEGATIVE", "NEIGHBOR", "NERVE", "NEST", "NETWORK", "NEVER", "NEWLY", "NEWS", "NEXT", "NICE", "NIGHT", "NOBODY", "NOISE", "NOISY", "NONE", "NOON", "NORMAL", "NORTH", "NOSE", "NOTE", "NOTHING", "NOTICE", "NOTION", "NOVEL", "NOWHERE", "NUCLEAR", "NUMBER", "NURSE", "OBJECT", "OBSERVE", "OBTAIN", "OBVIOUS", "OCCUR", "OCEAN", "ODOR", "OFFENSE", "OFFER", "OFFICE", "OFFICER", "OFFICIAL", "OFTEN", "OKAY", "OLDER", "ONCE", "ONLY", "ONTO", "OPEN", "OPENING", "OPERA", "OPINION", "OPPOSE", "OPTION", "ORANGE", "ORDER", "ORDINARY", "ORGAN", "ORIGIN", "OTHER", "OUGHT", "OUNCE", "OUTCOME", "OUTSIDE", "OVEN", "OVER", "OWNER", "PACE", "PACK", "PACKET", "PAGE", "PAIN", "PAINT", "PAIR", "PALACE", "PALE", "PANEL", "PANIC", "PAPER", "PARADE", "PARCEL", "PARDON", "PARENT", "PARK", "PART", "PARTNER", "PARTY", "PASS", "PASSAGE", "PAST", "PASTE", "PATH", "PATIENT", "PATTERN", "PAUSE", "PAYMENT", "PEACE", "PEAK", "PEAR", "PENALTY", "PENCIL", "PEOPLE", "PEPPER", "PERFECT", "PERFORM", "PERIOD", "PERMIT", "PERSON", "PHASE", "PHONE", "PHOTO", "PHRASE", "PHYSICAL", "PIANO", "PICK", "PICTURE", "PIECE", "PILE", "PILOT", "PINE", "PINK", "PIPE", "PITCH", "PLACE", "PLAIN", "PLAN", "PLANE", "PLANET", "PLANT", "PLASTIC", "PLATE", "PLATFORM", "PLAY", "PLAYER", "PLEASANT", "PLEASE", "PLEASURE", "PLENTY", "PLOT", "POCKET", "POEM", "POET", "POINT", "POISON", "POLICE", "POLICY", "POLISH", "POLITE", "POOL", "POOR", "POPULAR", "PORT", "POSE", "POSITION", "POSITIVE", "POSSESS", "POST", "POTATO", "POUND", "POUR", "POWDER", "POWER", "PRACTICE", "PRAISE", "PRAY", "PREACH", "PREFER", "PREFIX", "PREPARE", "PRESENT", "PRESS", "PRETTY", "PREVENT", "PRICE", "PRIDE", "PRIEST", "PRINCE", "PRINT", "PRIOR", "PRISON", "PRIZE", "PROBLEM", "PROCESS", "PRODUCE", "PRODUCT", "PROFIT", "PROGRAM", "PROGRESS", "PROJECT", "PROMISE", "PROMOTE", "PROOF", "PROPER", "PROPERTY", "PROPOSAL", "PROTECT", "PROUD", "PROVE", "PROVIDE", "PUBLIC", "PULL", "PUMP", "PUNCH", "PUNISH", "PUPIL", "PURE", "PURPLE", "PURPOSE", "PUSH", "QUALIFY", "QUALITY", "QUARTER", "QUEEN", "QUESTION", "QUICK", "QUIET", "QUITE", "QUOTE", "RACE", "RADIO", "RAIL", "RAIN", "RAISE", "RANGE", "RANK", "RAPID", "RARE", "RATE", "RATHER", "REACH", "REACT", "READ", "READER", "READY", "REAL", "REALIZE", "REAR", "REASON", "REBEL", "RECALL", "RECEIPT", "RECEIVE", "RECENT", "RECIPE", "RECOVER", "RECORD", "RECRUIT", "REDUCE", "REFER", "REFLECT", "REFORM", "REFUSE", "REGARD", "REGION", "REGRET", "REGULAR", "REJECT", "RELATE", "RELATION", "RELAX", "RELEASE", "RELIEF", "RELIEVE", "RELIGION", "RELY", "REMAIN", "REMARK", "REMIND", "REMOTE", "REMOVE", "RENT", "REPAIR", "REPEAT", "REPLACE", "REPLY", "REPORT", "REQUEST", "RESCUE", "RESEARCH", "RESIST", "RESOLVE", "RESORT", "RESOURCE", "RESPECT", "RESPOND", "REST", "RESULT", "RETAIN", "RETIRE", "RETURN", "REVEAL", "REVIEW", "REWARD", "RHYTHM", "RICE", "RICH", "RIDE", "RIDER", "RIGHT", "RING", "RISE", "RISK", "RIVER", "ROAD", "ROAST", "ROCK", "ROLE", "ROLL", "ROOF", "ROOM", "ROOT", "ROPE", "ROUGH", "ROUND", "ROUTE", "ROUTINE", "ROW", "ROYAL", "RUB", "RUBBER", "RUBBISH", "RUDE", "RUIN", "RULE", "RULER", "RUMOR", "RUN", "RUNNER", "RURAL", "RUSH", "SACK", "SACRED", "SAFE", "SAFETY", "SAIL", "SAKE", "SALAD", "SALARY", "SALE", "SALT", "SAME", "SAMPLE", "SAND", "SAVE", "SCALE", "SCENE", "SCHEDULE", "SCHEME", "SCHOOL", "SCIENCE", "SCORE", "SCREAM", "SCREEN", "SCREW", "SCRIPT", "SEARCH", "SEASON", "SEAT", "SECOND", "SECRET", "SECTION", "SECTOR", "SECURE", "SEED", "SEEK", "SEEM", "SEIZE", "SELECT", "SELF", "SELL", "SEND", "SENIOR", "SENSE", "SERIES", "SERIOUS", "SERVANT", "SERVE", "SERVICE", "SESSION", "SETTLE", "SEVEN", "SEVERAL", "SEVERE", "SHADE", "SHADOW", "SHAKE", "SHALL", "SHALLOW", "SHAME", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHELTER", "SHIFT", "SHINE", "SHIP", "SHIRT", "SHOCK", "SHOE", "SHOOT", "SHOP", "SHORT", "SHOT", "SHOULDER", "SHOUT", "SHOW", "SHOWER", "SHUT", "SICK", "SIDE", "SIGHT", "SIGN", "SIGNAL", "SIGNIFY", "SILENCE", "SILENT", "SILK", "SILLY", "SILVER", "SIMILAR", "SIMPLE", "SINCE", "SING", "SINGER", "SINGLE", "SINK", "SISTER", "SITE", "SIZE", "SKILL", "SKIN", "SKIRT", "SLEEP", "SLIDE", "SLIGHT", "SLIP", "SLOPE", "SLOW", "SMALL", "SMART", "SMELL", "SMILE", "SMOKE", "SMOOTH", "SNAKE", "SNAP", "SNOW", "SOAP", "SOCCER", "SOCIAL", "SOCIETY", "SOCK", "SOFT", "SOIL", "SOLDIER", "SOLID", "SOLVE", "SOME", "SONG", "SOON", "SORE", "SORRY", "SORT", "SOUL", "SOUND", "SOUP", "SOUR", "SOURCE", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPECIAL", "SPEECH", "SPEED", "SPELL", "SPEND", "SPILL", "SPIN", "SPIRIT", "SPITE", "SPLIT", "SPOIL", "SPOON", "SPORT", "SPOT", "SPRAY", "SPREAD", "SPRING", "SQUARE", "STABLE", "STAFF", "STAGE", "STAIR", "STAKE", "STAMP", "STAND", "STAR", "STARE", "START", "STATE", "STATION", "STATUE", "STATUS", "STAY", "STEAD", "STEAK", "STEAL", "STEAM", "STEEL", "STEEP", "STEER", "STEP", "STICK", "STIFF", "STILL", "STING", "STOCK", "STOMACH", "STONE", "STOOL", "STOP", "STORE", "STORM", "STORY", "STOVE", "STRAIN", "STRANGE", "STRAW", "STREAM", "STREET", "STRESS", "STRETCH", "STRICT", "STRIKE", "STRING", "STRIP", "STROKE", "STRONG", "STUDENT", "STUDIO", "STUDY", "STUFF", "STUPID", "STYLE", "SUBJECT", "SUBMIT", "SUCCEED", "SUCCESS", "SUCH", "SUDDEN", "SUFFER", "SUGAR", "SUGGEST", "SUIT", "SUMMER", "SUPPER", "SUPPLY", "SUPPORT", "SUPPOSE", "SURE", "SURFACE", "SURGERY", "SURPRISE", "SURROUND", "SURVIVE", "SUSPECT", "SWEAR", "SWEAT", "SWEEP", "SWEET", "SWIM", "SWING", "SWITCH", "SYMBOL", "SYMPATHY", "SYSTEM", "TABLE", "TAIL", "TAILOR", "TAKE", "TALE", "TALK", "TALL", "TANK", "TAPE", "TARGET", "TASK", "TASTE", "TAXI", "TEACH", "TEAM", "TEAR", "TELL", "TEMPER", "TENNIS", "TENSE", "TENT", "TERM", "TERRIBLE", "TEST", "TEXT", "THAN", "THANK", "THAT", "THEATER", "THEIR", "THEME", "THEN", "THEORY", "THERE", "THICK", "THIEF", "THIN", "THING", "THINK", "THIRD", "THIRST", "THIS", "THOUGH", "THREAT", "THROAT", "THROUGH", "THROW", "THUMB", "THUNDER", "TICKET", "TIDE", "TIDY", "TIE", "TIGHT", "TILE", "TILL", "TIME", "TINY", "TIRED", "TITLE", "TOAST", "TODAY", "TOGETHER", "TOILET", "TOMORROW", "TONE", "TONIGHT", "TONGUE", "TOOL", "TOOTH", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOUR", "TOWARD", "TOWEL", "TOWER", "TOWN", "TRACE", "TRACK", "TRADE", "TRAIL", "TRAIN", "TRAMP", "TRANSFER", "TRAP", "TRAVEL", "TRAY", "TREASURE", "TREAT", "TREE", "TRIAL", "TRICK", "TRIP", "TROUBLE", "TRUCK", "TRUE", "TRUST", "TRUTH", "TUBE", "TUNE", "TUNNEL", "TURN", "TWELVE", "TWENTY", "TWICE", "TWIN", "TWIST", "TYPE", "TYPICAL", "UGLY", "UNCLE", "UNDER", "UNION", "UNIQUE", "UNIT", "UNITE", "UNITY", "UNIVERSE", "UNLESS", "UNTIL", "UPON", "UPPER", "UPSET", "URGE", "URGENT", "USUAL", "VACATION", "VALLEY", "VALUABLE", "VALUE", "VARIETY", "VARIOUS", "VARY", "VAST", "VEGETABLE", "VEHICLE", "VENTURE", "VERB", "VERSION", "VERY", "VESSEL", "VICTIM", "VICTORY", "VIDEO", "VIEW", "VILLAGE", "VIOLENCE", "VIRUS", "VISIT", "VISUAL", "VITAL", "VOICE", "VOLUME", "VOTE", "WAGE", "WAIST", "WAIT", "WAKE", "WALK", "WALL", "WANDER", "WANT", "WARM", "WARN", "WASH", "WASTE", "WATCH", "WATER", "WAVE", "WEAK", "WEALTH", "WEAPON", "WEAR", "WEATHER", "WEAVE", "WEEK", "WEEKEND", "WEIGH", "WEIGHT", "WELCOME", "WELL", "WEST", "WESTERN", "WHEEL", "WHEN", "WHERE", "WHICH", "WHILE", "WHISPER", "WHISTLE", "WHITE", "WHOLE", "WICKED", "WIDE", "WIDOW", "WIFE", "WILD", "WILL", "WIND", "WINDOW", "WINE", "WING", "WINNER", "WINTER", "WIRE", "WISE", "WISH", "WITH", "WITHIN", "WITHOUT", "WITNESS", "WOMAN", "WONDER", "WOOD", "WOODEN", "WOOL", "WORD", "WORK", "WORLD", "WORRY", "WORSE", "WORTH", "WOULD", "WOUND", "WRAP", "WRIST", "WRITE", "WRITER", "WRONG", "YARD", "YEAR", "YELLOW", "YESTERDAY", "YOUNG", "YOUTH", "ZERO", "ZONE"
]);

export const getRandomStartingWord = (): { word: string, definition: string } => {
    const keys = Object.keys(BOT_VOCABULARY);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
        word: randomKey,
        definition: BOT_VOCABULARY[randomKey]
    };
};

export const playLocalWordChainTurn = (
    userWord: string,
    historyWords: string[]
): { isValid: boolean, invalidReason?: string, aiWord?: string, aiDefinition?: string } => {
    
    const normalizedUserWord = userWord.toUpperCase().trim();
    const lastHistoryWord = historyWords[historyWords.length - 1];
    
    // 1. Validation
    
    // Rule: Must start with last letter of previous word (if not start)
    if (historyWords.length > 0) {
        const requiredLetter = lastHistoryWord.slice(-1).toUpperCase();
        if (!normalizedUserWord.startsWith(requiredLetter)) {
            return { isValid: false, invalidReason: `Word must start with '${requiredLetter}'` };
        }
    }

    // Rule: No duplicates
    if (historyWords.map(w => w.toUpperCase()).includes(normalizedUserWord)) {
        return { isValid: false, invalidReason: "Word already used!" };
    }

    // Rule: Must be a real word (in our dataset)
    if (!COMMON_ENGLISH_WORDS.has(normalizedUserWord)) {
         // Fallback: If it ends in 'S' try singular, if 'ED' try past. (Rudimentary check)
         // For now, strict check to encourage simple words.
         return { isValid: false, invalidReason: "Word not in demo dictionary!" };
    }

    // 2. AI Turn logic
    const aiStartLetter = normalizedUserWord.slice(-1).toUpperCase();
    
    // Find candidates from BOT_VOCABULARY
    const candidates = Object.keys(BOT_VOCABULARY).filter(word => {
        return word.startsWith(aiStartLetter) && 
               !historyWords.includes(word) && 
               word !== normalizedUserWord;
    });

    if (candidates.length === 0) {
        // AI Concedes (Rare with this dataset, but possible)
        return { isValid: true, aiWord: undefined, invalidReason: "I'm out of words! You win!" };
    }

    // Pick random candidate
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selectedWord = candidates[randomIndex];
    const definition = BOT_VOCABULARY[selectedWord];

    return {
        isValid: true,
        aiWord: selectedWord,
        aiDefinition: definition
    };
};
