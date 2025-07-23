import { supabase } from '@/integrations/supabase/client';

// Your CSV data
const hymnData = `42	1	O magnify the Lord with me
42	2	Ye people of His choice!
42	3	Let all to whom He lendeth breath
42	4	Now in His name rejoice;
42	5	For love's blest revelation
42	6	For rest from condemnation
42	7	For uttermost salvation
42	8	To Him give thanks.
42	9	Let all the people praise Thee
42	10	Let all the people praise Thee!
42	11	Let all the people praise Thy name Forever and forever more. For evermore, O Lord!
42	12	Let all the people praise Thee
42	13	Let all the people praise Thee!
42	14	Let all the people praise Thy name Forever and forever more.
42	15	O praise Him for His holiness	His wisdom and his grace;
42	16	Sing praises for the precious blood Which ransomed all our race?
42	17	In tenderness He sought us, From depths of sin He brought us, The way of life then taught us, To Him give thanks.
42	18	Had I a thousand tongues to sing	The half could ne'er be told
42	19	Of love so rich	so full and free
42	20	Of blessings manifold;
42	21	Of grace that faileth never
42	22	Peace flowing as a river From God the glorious giver, To Him give thanks.
393	1	I'm pressing on the upward way, New heights I'm gaining every day; Still praying as I onward bound
393	2	Lord plant my feet on Higher ground.
393	3	Lord, lift me up and let me stand, By faith, on heaven's table-stand;
393	4	Where love	and joy and light abound	Lord	plant my feet on higher ground.
393	5	My heart has no desire to stay Where doubts arise, and fears dismay;
393	6	Though some may dwell where abound, My constant aim is higher ground.
393	7	Beyond the mist I fain would rise To rest beneath unclouded skies, Above earth's turmoil peace is found By those who dwell on higher ground.
393	8	I long to scale the utmost height, Though rough the way, and hard the fight, My song, while climbing, shall resound Lord, lead me on higher ground.
393	9	Lord	lead me up the mountain side I dare not climb without my guide;
393	10	And	heaven gained	I'll gaze around	With grateful heart from higher ground.
881	1	My faith looks up to Thee, Thou Lamb of Calvary,
881	2	Savior divine
881	3	Now hear me while I pray; Take all my guilts away; Oh, let me from this day Be wholly thine.
881	4	May Thy rich grace impart; Strength to my fainting heart, My zeal inspire;
881	5	As Thou hast died for me, Oh, may my love to Thee Pure, warm and changeless be A living fire
881	6	While life's dark maze I tread, And griefs around me spread, Be Thou my Guide;
881	7	Bid darkness turn today
881	8	Wipe sorrow's tears away;
881	9	Nor let me ever stray
881	10	From Thee aside
881	11	When ends life's transient dream When death's cold sullen stream
881	12	Shall o'er me roll;
881	13	Blest Savior, then in love, Fear and distress remove; Oh, bear me safe above A ransomed soul.
3	1	Praise Him; praise Him, Jesus our blessed Redeemer; Sin, O earth, His wonderful love proclaim, Hail Him! Hail Him!
3	2	Highest archangels in glory, Strength and honor give to His holy name Like a shepherd, Jesus will guard His children, In His arms He carries them all they long;
3	3	O ye saints that dwell on the mountain of Zion	Praise Him! Praise Him! Ever in joyful song
3	4	Praise Him; praise Him, Jesus our blessed Redeemer; For our sins He suffered and bled and died;
3	5	He, our rock, our hope of eternal salvation, Hail Him, Hail Him, Jesus the crucified, Loving Savior, meekly enduring sorrow, Crowned with thorns that cruelly pierced His brow;
3	6	Once for us rejected, despised and forsaken,
3	7	Prince of Glory	ever triumphant now.
3	8	Praise Him; praise Him, Jesus our blessed Redeemer; Heavenly portals loud with hosannas ring;
3	9	Jesus	Savior	reigneth for ever and ever
3	10	Crown Him; crown Him	Prophet and Priest and King
3	11	Death is vanquished	tell it joy ye faithful
3	12	Where is now thy victory	boasting grave?
3	13	Jesus lives, no longer thy portals are cheerless, Jesus lives, the mighty and strong to save
806	1	There's not a friend, like the lowly Jesus No, not one; no not one!
806	2	None else could heal all our soul's diseases No, not one; no not one!
806	3	Jesus knows all about our struggles
806	4	He will guide till the day is done
806	5	There's not a friend like the lowly Jesus No not one; no not one!
806	6	No friend like Him is so high and holy No, not one; no not one!
806	7	And yet no friend is so meek and lowly No, not one; no not one!
806	8	There's not an hour that He is not near us
806	9	No	not one; no not one!
806	10	No night so dark but His love can cheer us No, not one; no not one!
806	11	Did ever saint find this friend forsake him? No, not one; no not one!
806	12	Or sinner find that He would not take him?
806	13	No	not one; no not one!
806	14	Was e'er a gift like the savior given?
806	15	No	not one; no not one!
806	16	Will he refuse us a home in heaven?
806	17	No	not one; no not one!
791	1	Lord, dismiss us with Thy blessing. Fill our hearts with joy and peace;
791	2	Let us each, Thy love possessing, Triumph in redeeming grace: Oh, refresh us,
791	3	Traveling though this wilderness!
791	4	Thanks we give, and adoration For Thy Gospel's joyful sound;
791	5	May the fruits of Thy salvation In our hearts and lives abound; May Thy presence;
791	6	With us evermore be found!
791	7	So whene'er the signal's given
791	8	Us from earth to call away
791	9	Borne on angel's wings to heaven
791	10	Glad the summons to obey
791	11	We shall surely
791	12	Reign with Christ in endless day.
8	1	Oh for a thousand tongues to sing
8	2	My great redeemer's praise
8	3	The glories of my God my King
8	4	The triumphs of His grace
8	5	My gracious Master and my God
8	6	Assist me to proclaim
8	7	To spread through all the earth abroad
8	8	The honor of thy name
8	9	Jesus the name that charms our fears,
8	10	That bids our sorrows cease;
8	11	Tis music in the sinner's ears
8	12	Tis life and health and peace
8	13	He breaks the power of cancelled sin
8	14	He sets the prisoners free
8	15	His blood can make the foulest clean
8	16	His blood availed for me.
8	17	Hear Him, ye deaf; His praise ye dumb Your loosened tongues employ
8	18	Ye blind behold your savior come Ad leap ye lame for joy.
812	1	When the power of God descended
812	2	On the day of Pentecost
812	3	All the days of waiting ended
812	4	They received the Holy Ghost
812	5	O Lord, send the power just now
812	6	O Lord, send the power just now O Lord, send the power just now And baptize everyone.
812	7	Tongues of flame came down upon them, And they preached the word in power;
812	8	Listening multitudes awakened, Turned to God that very hour
812	9	We are waiting Holy Spirit
812	10	We are all of one accord
812	11	Lord fulfill just now the promise
812	12	That is given in the word.
812	13	Fill and thrill us with thy presence Grant the blessing that we need Flood our souls with wondrous glory While the prayer of faith we plead.
276	1	Wonderful story of love Tell it to me again Wonderful story of love Wake the immortal strain
276	2	Angels with rapture announce it. Shepherds with wonder receive it, Sinners O won't you believe it Wonderful story of love
276	3	Wonderful......Wonderful
276	4	Wonderful... Wonderful story of love
276	5	Wonderful story of love Though you are far away Wonderful story of love Still he doth call today Calling from Calvary's mountain Down from the crystal bright fountain E'en from the dawn of creation
276	6	Wonderful story of love
276	7	Wonderful story of love Jesus provides a rest
276	8	Wonderful story of love
276	9	For all the pure and blest
276	10	Rest in those mansions above us
276	11	With those who've gone on before us
276	12	Singing the rapturous chorus
276	13	Wonderful story of love
55	1	Praise the King of glory, He is God alone Praise Him for the wonders He to us hath shown;
55	2	For His promised presence all the pilgrim way For the flaming pillar and the cloud by day.
55	3	Praise Him shining angels
55	4	Strike your harps of gold
55	5	All His hosts adore Him	Who His face behold
55	6	Through His great dominion, while the ages roll All His works shall praise Him, bless the Lord my soul.
55	7	Praise Him for redemption, free to every soul Praise Him for the fountain that can make us whole For his gifts of kindness and His loving care;
55	8	For the blest assurance that He answers prayer
55	9	Praise Him for the trials sent as cords of love Binding us more closely to the things above For the faith that conquers hope that naught can dim For the land where loved ones gather unto Him
532	1	What a friend we have in Jesus All our sins and griefs to bear What a privileged to carry Everything to God in prayer Oh what peace we often forfeit Oh what needless pain we bear All because we do not carry Everything to God in prayer
532	2	Have we trials and temptations Is there trouble anywhere? We should never be discouraged Take it to the lord in prayer Can we find a friend so faithful?
532	3	Who will all our sorrows share?
532	4	Jesus knows our every weakness Take it to the Lord in prayer
532	5	Are we weak and heavy laden? Cumbered with a load of care? Precious savior, still our refuge
532	6	Take it to the Lord in prayer
532	7	Do thy friends despise forsake thee? Take it to the Lord in prayer
532	8	In His arms He'll take and shield thee Thou wilt find a solace there.
670	1	I am so Glad that our father in Heaven Tells of His love in the book He has given Wonderful things in the bible I see This is the dearest that Jesus loves me
670	2	I am so glad, that Jesus loves me Jesus loves me. Jesus loves me
670	3	I am so glad	that Jesus loves me Jesus loves even me.
670	4	Jesus loves me and I know I love Him
670	5	Love brought Him down my lost soul to redeem
670	6	Yes it was love made Him die on the tree
670	7	Oh	I am certain that Jesus loves me
670	8	In this assurance I find sweetest rest Trusting in Jesus I know I am blest Satan dismayed from my soul doth now flee When I just that Jesus loves me
670	9	Oh if there's only one song I can sing When in His beauty I see the great King This shall my song in eternity be
670	10	Oh what a wonder that Jesus love me
670	11	If one should ask of me	how can I tell?
670	12	Glory to Jesus, I know very well God's Holy Spirit with mine doth agree Constantly witnessing Jesus loves me
801	1	How sweet the Name of Jesus sounds Blessed be the name of the Lord
801	2	It soothes his sorrows, heals his wounds Blessed be the name of the Lord
801	3	Blessed be the name, blessed be the name Blessed be the name of the Lord
801	4	Blessed be the name, blessed be the name Blessed be the name of the Lord
801	5	It makes the wounded spirit whole Blessed be the name of the Lord 'Tis manna to the hungry soul Blessed be the name of the Lord
801	6	It soothes the troubled sinner's breast Blessed be the name of the Lord It gives the weary sweetest rest Blessed be the name of the Lord
801	7	Then will I tell the sinners round Blessed be the name of the Lord What a dear savior I have found Blessed be the name of the Lord
246	1	1) Revive Thy work	O Lord
246	2	Thy mighty arm make bare;
246	3	Speak with the voice that wakes the dead	And make Thy people hear.
246	4	Revive Thy work, O Lord While here to Thee, we bow Descend, O gracious Lord descend O come and bless us now
246	5	2) Revive Thy work	O Lord	Disturb this sleep of death; Quicken the smold'ring embers now By Thine almighty breath.
246	6	3) Revive Thy work	O Lord	Create soul-thirst for Thee;
246	7	And hungering for the Bread of Life O may our spirits be.
246	8	4) Revive Thy work	O Lord	Exalt Thy precious Name;
246	9	And	by the Holy Ghost	our love For Thee and Thine inflame
245	1	There shall be showers of blessing:
245	2	This is the promise of love;
245	3	There shall be seasons refreshing
245	4	Sent from the Savior above.
245	5	Showers of blessing
245	6	Showers of blessing we need:
245	7	Mercy drops round us are falling
245	8	But for the showers we plead.
245	9	There shall be showers of blessing, Precious reviving again;
245	10	Over the hills and the valleys
245	11	Sound of abundance of rain.
245	12	There shall be showers of blessing;
245	13	Send them upon us, O Lord; Grant to us now a refreshing,
245	14	Come	and now honor Thy Word.
245	15	There shall be showers of blessing, Oh, that today they might fall, Now as to God we're confessing, Now as on Jesus we call!
245	16	There shall be showers of blessing, If we but trust and obey;
245	17	There shall be seasons refreshing
245	18	If we let God have His way.
112	1	The Lord Jehovah reigns; His throne is built on high.
112	2	The garments He assumes are light and majesty.
112	3	His glories shine with beams so bright
112	4	No mortal eye can bear the sight.
112	5	No mortal eye can bear the sight.
112	6	The thunders of His hand keep the wide world in awe;
112	7	His wrath and justice stand to guard His holy law.
112	8	And where His love resolves to bless
112	9	His truth confirms and seals the grace.
112	10	His truth confirms and seals the grace.
112	11	Through all His mighty works surprising wisdom shines
112	12	Confounds the powers of hell, and breaks their cursed designs.
112	13	Strong is His arm	and shall fulfill
112	14	His great decrees	His sovereign will.
112	15	His great decrees	His sovereign will.
112	16	And will this mighty king of glory condescend,
112	17	And will He write His name: My Father and my friend?
112	18	I love His name; I love His Word.
112	19	Join	all my powers	and praise the Lord!
112	20	Join	all my powers	and praise the Lord!
488	1	Away, my needless fears,
488	2	And doubts no longer mine;
488	3	A ray of heavenly light appears, A messenger divine.
488	4	Thrice comfortable hope,
488	5	That calms my troubled breast;
488	6	My Father's hand prepares the cup
488	7	And what he wills is best.
488	8	If what I wish is good,
488	9	And suits the will divine;
488	10	By earth and hell in vain withstood, I know it shall be mine.
488	11	Still let them counsel take
488	12	To frustrate his decree
488	13	They cannot keep a blessing back
488	14	By heaven designed for me.
488	15	Here then I doubt no more,
488	16	But in his pleasure rest
488	17	Whose wisdom, love, and truth, and power, Engage to make me blest.
488	18	To accomplish his design The creatures all agree;
488	19	And all the attributes divine
488	20	Are now at work for me
341	1	Rock of Ages, cleft for me, Let me hide myself in Thee;
341	2	Let the water and the blood, From Thy wounded side which flowed,
341	3	Be of sin the double cure;
341	4	Save from wrath and make me pure.
341	5	Not the labor of my hands
341	6	Can fulfill Thy law's demands;
341	7	Could my zeal no respite know, Could my tears forever flow, All for sin could not atone; Thou must save, and Thou alone.
341	8	Nothing in my hand I bring, Simply to the cross I cling; Naked, come to Thee for dress;
341	9	Helpless look to Thee for grace;
341	10	Foul, I to the fountain fly; Wash me, Savior, or I die.
341	11	While I draw this fleeting breath, When mine eyelids close in death, When I soar to worlds unknown, See Thee on Thy judgment throne, Rock of Ages, cleft for me, Let me hide myself in Thee
834	1	Christ our Redeemer died on the cross, Died for the sinner, paid all his due.
834	2	All who receive Him need never fear, Yes, He will pass, will pass over you.
834	3	When I see the blood, when I see the blood,
834	4	When I see the blood	I will pass
834	5	I will pass over you.
834	6	Chiefest of sinners, Jesus will save; As He has promised, so He will do; Oh, sinner, hear Him, trust in His Word, Then He will pass, will pass over you.
834	7	Judgment is coming, all will be there. Who have rejected, who have refused? Oh, sinner, hasten, let Jesus in,
834	8	Oh	He will pass	will pass over you.
834	9	O great compassion! O boundless love! Jesus hath power, Jesus is true;
834	10	All who believe are safe from the storm, Oh, He will pass, will pass over you
896	1	My soul is so happy in Jesus, For He is so precious to me;
896	2	His voice it is music to hear it,
896	3	His face it is Heaven to see.
896	4	I am happy in Him
896	5	I am happy in Him;
896	6	My soul with delight
896	7	He fills day and night
896	8	For I am happy in Him.
896	9	He sought me so long ere I knew Him, When wandering afar from the fold;
896	10	Safe home in His arms He hath brought me
896	11	To where there are pleasures untold.
896	12	His love and His mercy surround me, His grace like a river doth flow;
896	13	His Spirit	to guide and to comfort
896	14	Is with me wherever I go.
896	15	They say I shall someday be like Him, My cross and my burden lay down;
896	16	Till then I will ever be faithful
896	17	In gathering gems for His crown
39	1	Praise to the Lord, the Almighty, The king of creation!
39	2	O my soul, praise Him, for He is thy health and salvation!
39	3	All ye who hear, now to His temple draw near; Praise Him in glad adoration.
39	4	Praise to the Lord, who doth Prosper thy work and defend thee;
39	5	Surely His goodness and mercy here daily attend thee. Ponder anew what the Almighty can do,
39	6	If with His love He befriend thee.
39	7	Praise to the Lord, who, When tempests their warfare are waging,
39	8	Who, when the elements madly around thee are raging, Biddeth them cease, turneth their fury to peace, Whirlwinds and waters assuaging.
39	9	Praise to the Lord, who, When darkness of sin is abounding,
39	10	Who, when the godless do triumph,
39	11	All virtue confounding
39	12	Sheddeth His light, chaseth the horrors of night, Saints with His mercy surrounding.
39	13	Praise to the Lord
39	14	O let all that is in me adore Him!
39	15	All that hath life and breath,
39	16	Come now with praises before Him.
39	17	Let the Amen sound from His people again, Gladly for aye we adore Him.
313	1	Today Thy mercy calls me To wash away my sin; However great my trespass, What'er I may have been;
313	2	However long from mercy I may have turned away,
313	3	Thy blood	O Christ	can cleanse me
313	4	And make me white today.
313	5	Today Thy gate is open
313	6	And all who enter in
313	7	Shall find a Father's welcome
313	8	Aand pardon for their sin;
313	9	The past shall be forgotten
313	10	A present joy be given;
313	11	A future grace be promised
313	12	A glorious crown in Heaven.
313	13	O all embracing mercy, Thou ever open door,
313	14	What shall I do without thee
313	15	When heart and eyes run o'er?
313	16	When all things seem against me
313	17	To drive me to despair
313	18	I know one gate is open
313	19	One ear will hear my prayer.
894	1	We are never, never weary Of the grand old song; Glory to God, hallelujah!
894	2	We can sing it loud as ever, With our faith more strong; Glory to God, hallelujah!
894	3	O, the children of the Lord Have a right to shout and sing, For the way is growing bright,
894	4	And our souls are on the wing;
894	5	We are going by and by to the palace of a King! Glory to God	hallelujah!
894	6	We are lost amid the rapture of redeeming love
894	7	Glory to God	hallelujah!
894	8	We are rising on its pinions to the hills above: Glory to God, hallelujah!
894	9	We are going to a palace that is built of gold; Glory to God, hallelujah!
894	10	Where the King in all His splendor
894	11	We shall soon behold
894	12	Glory to God	hallelujah!
894	13	There we'll shout redeeming mercy
894	14	In a glad	new song;
894	15	Glory to God	hallelujah!
894	16	There we'll sing the praise of Jesus
894	17	With the blood washed throng;
894	18	Glory to God	hallelujah!
410	1	Deeper, deeper in the love of Jesus
410	2	Daily let me go;
410	3	Higher, higher in the school of wisdom, More of grace to know.
410	4	O deeper yet, I pray, And higher every day, And wiser, blessed Lord,
410	5	In Thy precious	holy Word.
410	6	Deeper, deeper, blessed Holy Spirit,
410	7	Take me deeper still
410	8	Till my life is wholly lost in Jesus
410	9	And His perfect will.
410	10	Deeper, deeper! though it cost hard trials,
410	11	Deeper let me go!
410	12	Rooted in the holy love of Jesus,
410	13	Let me fruitful grow.
410	14	Deeper, higher, every day in Jesus,
410	15	Till all conflict past
410	16	Finds me conqueror	and in His own image
410	17	Perfected at last.
261	1	Standing on the promises of Christ my King, Through eternal ages let His praises ring, Glory in the highest, I will shout and sing, Standing on the promises of God.
261	2	Standing, standing,
261	3	Standing on the promises of God my Savior;
261	4	Standing, standing,
261	5	I'm standing on the promises of God.
261	6	Standing on the promises that cannot fail, When the howling storms of doubt and fear assail, By the living Word of God I shall prevail, Standing on the promises of God.
261	7	Standing on the promises I now can see Perfect, present cleansing in the blood for me;
261	8	Standing in the liberty where Christ makes free	Standing on the promises of God.
261	9	Standing on the promises of Christ the Lord, Bound to Him eternally by love's strong cord, Overcoming daily with the Spirit's sword, Standing on the promises of God.
47	1	To God be the glory, great things He has done;
47	2	So loved He the world that He gave us His Son, Who yielded His life an atonement for sin, And opened the life gate that all may go in.
47	3	Praise the Lord, praise the Lord, Let the earth hear His voice!
47	4	Praise the Lord, praise the Lord,
47	5	Let the people rejoice!
47	6	O come to the Father, through Jesus the Son, And give Him the glory, great things He has done.
47	7	O perfect redemption, the purchase of blood, To every believer the promise of God;
47	8	The vilest offender who truly believes
47	9	That moment from Jesus a pardon receives.
47	10	Great things He has taught us, great things He has done, And great our rejoicing through Jesus the Son;
47	11	But purer	and higher	and greater will be
47	12	Our wonder	our transport	when Jesus we see
45	1	Be glad in the Lord, and rejoice,
45	2	All ye that are upright in heart;
45	3	And ye that have made Him your choice
45	4	Bid sadness and sorrow depart.
45	5	Rejoice, rejoice,
45	6	Be glad in the Lord and rejoice;
45	7	Rejoice, rejoice,
45	8	Be glad in the Lord and rejoice
45	9	Be joyful, for He is the Lord,
45	10	On earth and in Heaven supreme;
45	11	He fashions and rules by His word
45	12	The Mighty and Strong to redeem.
45	13	What though in the conflict for right Your enemies almost prevail?
45	14	God's armies	just hid from your sight	Are more than the foes which assail.
45	15	Though darkness surround you by day, Your sky by the night be o'ercast, Let nothing your spirit dismay, But trust till the danger is past.
45	16	Be glad in the Lord, and rejoice, His praises proclaiming in song;
45	17	With harp and with organ and voice The loud hallelujahs prolong
5	1	Praise, my soul, the King of Heaven;
5	2	To His feet thy tribute bring.
5	3	Ransomed, healed, restored, forgiven, Who like thee His praise should sing:
5	4	Praise Him Praise Him (2x)
5	5	Praise the everlasting King.
5	6	Praise Him for His grace and favor
5	7	To our fathers in distress.
5	8	Praise Him still the same for ever, Slow to chide, and swift to bless.
5	9	Praise Him Praise Him (2x) Glorious in His faithfulness.
5	10	Father like He tends and spares us; Well our feeble frame He knows.
5	11	In His hands He gently bears us, Rescues us from all our foes.
5	12	Praise Him Praise Him (2x) Widely as His mercy flows.
5	13	Angels, help us to adore him; you behold him face to face. Sun and moon, bow down before him,
5	14	dwellers all in time and space.
5	15	Alleluia	alleluia!
5	16	Praise with us the God of grace!
262	1	Lord, Thy Word abideth,
262	2	And our footsteps guideth;
262	3	Who its truth believeth
262	4	Light and joy receiveth.
262	5	When our foes are near us, Then Thy Word doth cheer us, Word of consolation, Message of salvation.
262	6	When the storms are o'er us, And dark clouds before us, Then its light directeth,
262	7	And our way protecteth.
262	8	Who can tell the pleasure, Who recount the treasure, By Thy Word imparted To the simple hearted?
262	9	Word of mercy, giving Succor to the living; Word of life, supplying Comfort to the dying!
262	10	O that we	discerning
262	11	Its most holy learning
262	12	Lord	may love and fear Thee	Evermore be near Thee!
477	1	When we walk with the Lord in the light of His Word,
477	2	What a glory He sheds on our way!
477	3	While we do His good will, He abides with us still, And with all who will trust and obey.
477	4	Trust and obey, for there's no other way To be happy in Jesus, but to trust and obey.
477	5	Not a shadow can rise, not a cloud in the skies,
477	6	But His smile quickly drives it away;
477	7	Not a doubt or a fear, not a sigh or a tear,
477	8	Can abide while we trust and obey.
477	9	Not a burden we bear, not a sorrow we share,
477	10	But our toil He doth richly repay;
477	11	Not a grief or a loss, not a frown or a cross,
477	12	But is blessed if we trust and obay.
477	13	But we never can prove the delights of His love
477	14	Until all on the altar we lay;
477	15	For the favor He shows, and the joy He bestows,
477	16	Are for them who will trust and obey.
477	17	Then in fellowship sweet we will sit at His feet.
477	18	Or we'll walk by His side in the way.
477	19	What He says we will do, where He sends we will go;
477	20	Never fear	only trust and obey
10	1	O worship the King, all glorious above, O gratefully sing His power and His love;
10	2	Our shield and defender, the Ancient of Days, Pavilioned in splendor, and girded with praise.
10	3	O tell of His might, O sing of His grace, Whose robe is the light, whose canopy space, His chariots of wrath the deep thunderclouds form, And dark is His path on the wings of the storm.
10	4	Thy bountiful care, what tongue can recite? It breathes in the air, it shines in the light;
10	5	It streams from the hills, it descends to the plain, And sweetly distills in the dew and the rain.
10	6	Frail children of dust, and feeble as frail, In Thee do we trust, nor find Thee to fail;
10	7	Thy mercies how tender, how firm to the end, Our maker, defender, redeemer, and friend.
10	8	O measureless might! Ineffable love! While angels delight to worship Thee above, The humbler creation, though feeble their lays, With true adoration shall all sing Thy praise.
582	1	Take my life, and let it be Consecrated, Lord, to Thee. Take my moments and my days;
582	2	Let them flow in ceaseless praise.
582	3	Take my hands, and let them move At the impulse of Thy love.
582	4	Take my feet, and let them be Swift and beautiful for Thee.
582	5	Take my voice, and let me sing Always, only, for my King.
582	6	Take my lips, and let them be Filled with messages from Thee.
582	7	Take my silver and my gold; Not a mite would I withhold.
582	8	Take my intellect, and use Every power as Thou shalt choose.
582	9	Take my will, and make it Thine; It shall be no longer mine. Take my heart, it is Thine own;
582	10	It shall be Thy royal throne.
582	11	Take my love, my Lord, I pour At Thy feet its treasure store. Take myself, and I will be
582	12	Ever	only	all for Thee.
524	1	My Jesus, I love Thee, I know Thou art mine; For Thee all the follies of sin I resign.
524	2	My gracious Redeemer, my Savior art Thou; If ever I loved Thee, my Jesus, 'tis now.
524	3	I love Thee because Thou has first loved me, And purchased my pardon on Calvary's tree.
524	4	I love Thee for wearing the thorns on Thy brow; If ever I loved Thee, my Jesus, 'tis now.
524	5	I'll love Thee in life, I will love Thee in death, And praise Thee as long as Thou lendest me breath;
524	6	And say when the death dew lies cold on my brow
524	7	If ever I loved Thee	my Jesus	tis now.
524	8	In mansions of glory and endless delight,
524	9	I'll ever adore Thee in heaven so bright;
524	10	I'll sing with the glittering crown on my brow;
524	11	If ever I loved Thee	my Jesus	tis now.
284	1	Jesus only is our message, Jesus all our theme shall be;
284	2	We will lift up Jesus ever	Jesus only will we see.
284	3	Jesus only, Jesus ever, Jesus all in all we sing, Savior, Sanctifier, and Healer, Glorious Lord and coming King.
284	4	Jesus only is our Savior, All our guilt He bore away,
284	5	All our righteousness He gives us	All our strength from day to day.
284	6	Jesus is our Sanctifier, Cleansing us from self and sin, And with all His Spirit's fullness, Filling all our hearts within.
284	7	Jesus only is our Healer,
284	8	All our sicknesses He bare
284	9	And His risen life and fullness
284	10	All His members still may share.
284	11	Jesus only is our Power,
284	12	He the Gift of Pentecost
284	13	Jesus	breathe Thy pow'r upon us
284	14	Fill us with the Holy Ghost.
284	15	And for Jesus we are waiting, List'ning for the advent call;
284	16	But 'twill still be Jesus only, Jesus ever, all in all
619	1	O happy day, that fixed my choice On Thee, my Savior and my God!
619	2	Well may this glowing heart rejoice, And tell its raptures all abroad.
619	3	Happy day, happy day,
619	4	When Jesus washed my sins away!
619	5	He taught me how to watch and pray, And live rejoicing every day Happy day, happy day,
619	6	When Jesus washed my sins away
619	7	Tis done: the great transaction's done! I am the Lord's and He is mine;
619	8	He drew me, and I followed on; Charmed to confess the voice divine.
619	9	Now rest, my long divided heart, Fixed on this blissful center, rest. Here have I found a nobler part;
619	10	Here heavenly pleasures fill my breast.
619	11	High heaven, that heard the solemn vow,
619	12	That vow renewed shall daily hear
619	13	Till in life's latest hour I bow
619	14	And bless in death a bond so dear
100	1	Pleasant are Thy courts above, In the land of light and love; Pleasant are Thy courts below
100	2	In this land of sin and woe; O, my spirit longs and faints For the converse of Thy saints, For the brightness of Thy face, For Thy fullness, God of grace.
100	3	Happy birds that sing and fly Round Thy altars, O most High;
100	4	Happier souls that find a rest In a heavenly Father's breast;
100	5	Like the wandering dove that found No repose on earth around, They can to their ark repair, And enjoy it ever there.
100	6	Happy souls, their praises flow Even in this vale of woe;
100	7	Waters in the desert rise
100	8	Manna feeds them from the skies;
100	9	On they go from strength to strength, Till they reach Thy throne at length,
100	10	At Thy feet adoring fall
100	11	Who hast led them safe through all.
100	12	Lord, be mine this prize to win, Guide me through a world of sin,
100	13	Keep me by Thy saving grace, Give me at Thy side a place;
100	14	Sun and shield alike Thou art	Guide and guard my erring heart.
100	15	Grace and glory flow from Thee; Shower, O shower them, Lord, on me373
373	1	Jesus hath died and hath risen again, Pardon and peace to bestow;
373	2	Fully I trust Him; from sin's guilty stain, Jesus saves me now.
373	3	Jesus saves me now,
373	4	Jesus saves me now;
373	5	Yes, Jesus saves me all the time: Jesus saves me now.
373	6	Sin's condemnation is over and gone, Jesus alone knoweth how;
373	7	Life and salvation my soul hath put on: Jesus saves me now.
373	8	Jesus is stronger than Satan and sin, Satan to Jesus must bow;
373	9	Therefore I triumph without and within: Jesus saves me now.
373	10	Sorrow and pain may beset me about, Nothing can darken my brow;
373	11	Battling in faith, I can joyfully shout: "Jesus saves me now."
451	1	Just lean upon the arms of Jesus, He'll help you along, help you along, If you will trust His love unfailing, He'll fill your heart with song.
451	2	Lean on His arms, trusting in His love;
451	3	Lean on His arms, all His mercies prove;
451	4	Lean on His arms, looking home above,
451	5	Just lean on the Savior's arms!
451	6	Just lean upon the arms of Jesus.
451	7	He'll brighten the way, brighten the way,
451	8	Just follow gladly where He leadeth,
451	9	His gentle voice obey.
451	10	Just lean upon the arms of Jesus, O bring ev'ry care, bring ev'ry care! The burden that has seemed so heavy, Take to the Lord in prayer.
451	11	Just lean upon the arms of Jesus, Then leave all to Him, leave all to Him;
451	12	His heart is full of love and mercy, His eyes are never dim.
451	13	Just lean upon the arms of Jesus
451	14	He meets every need	meets every need
451	15	To all who take Him as a savior
451	16	He is a friend indeed
109	1	Let us, with a gladsome mind, Praise the Lord, for He is kind.
109	2	For His mercies shall endure, Ever faithful, ever sure.
109	3	Let us sound His Name abroad, For of gods He is the God.
109	4	For His mercies shall endure, Ever faithful, ever sure.
109	5	He with all commanding might Filled the new made world with light.
109	6	For His mercies shall endure, Ever faithful, ever sure.
109	7	All things living He doth feed, His full hand supplies their need.
109	8	For His mercies shall endure, Ever faithful, ever sure.
109	9	He hath, with a piteous eye, Looked upon our misery. For His mercies shall endure, Ever faithful, ever sure.
109	10	He His chosen race did bless In the wasteful wilderness. For His mercies shall endure, Ever faithful, ever sure.
109	11	Let us, with a gladsome mind, Praise the Lord, for He is kind.
109	12	For His mercies shall endure, Ever faithful, ever sure.
611	1	I will sing of my Redeemer, And His wondrous love to me;
611	2	On the cruel cross He suffered	From the curse to set me free.
611	3	Sing, oh sing, of my Redeemer, With His blood, He purchased me.
611	4	On the cross, He sealed my pardon, Paid the debt, and made me free.
611	5	I will tell the wondrous story, How my lost estate to save, In His boundless love and mercy, He the ransom freely gave.
611	6	I will praise my dear Redeemer, His triumphant power I'll tell, How the victory He giveth Over sin, and death, and hell.
611	7	I will sing of my Redeemer, And His heav'nly love to me;
611	8	He from death to life hath brought me
611	9	Son of God with Him to be
24	1	Come, sound His praise abroad, And hymns of glory sing; Jehovah is the sovereign God, The universal King.
24	2	Praise ye the Lord, Hallelujah Praise ye the Lord, Hallelujah Hallelujah, Hallelujah; Hallelujah, Praise ye the Lord
24	3	He formed the deeps unknown;
24	4	He gave the seas their bound;
24	5	The watery worlds are all His own
24	6	And all the solid ground.
24	7	Come, worship at His throne;
24	8	Come	bow before the Lord:
24	9	We are His works, and not our own;
24	10	He formed us by His Word.
24	11	Today attend His voice,
24	12	Nor dare provoke His rod;
24	13	Come, like the people of His choice, And own your gracious God.
377	1	My faith has found a resting place,
377	2	Not in device or creed;
377	3	I trust the ever living One
377	4	His wounds for me shall plead.
377	5	I need no other argument,
377	6	I need no other plea
377	7	It is enough that Jesus died
377	8	And that He died for me.
377	9	Enough for me that Jesus saves, This ends my fear and doubt;
377	10	A sinful soul I come to Him, He'll never cast me out.
377	11	My heart is leaning on the Word, The written Word of God, Salvation by my Savior's name, Salvation through His blood.
377	12	My great physician heals the sick,
377	13	The lost He came to save;
377	14	For me His precious blood He shed
377	15	For me His life He gave.
444	1	Ho, my comrades! see the signal Waving in the sky!
444	2	Reinforcements now appearing, Victory is nigh.
444	3	Hold the fort, for I am coming,
444	4	Jesus signals still;
444	5	Wave the answer back to Heaven, By Thy grace we will.
444	6	See the mighty host advancing, Satan leading on;
444	7	Mighty men around us falling, Courage almost gone!
444	8	See the glorious banner waving! Hear the trumpet blow!
444	9	In our leader's name we triumph Over every foe.
444	10	Fierce and long the battle rages,
444	11	But our help is near;
444	12	Onward comes our great commander, Cheer, my comrades, cheer!`;

export const parseAndImportHymns = async () => {
  try {
    console.log('Starting hymn import...');
    
    // Parse the CSV data
    const lines = hymnData.trim().split('\n');
    const hymnRows = lines.map(line => {
      const parts = line.split('\t');
      return {
        hymn_number: parseInt(parts[0]),
        line_number: parseInt(parts[1]), 
        line_content: parts[2] || ''
      };
    });

    console.log(`Parsed ${hymnRows.length} hymn lines`);

    // Insert in batches to avoid overwhelming the database
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < hymnRows.length; i += batchSize) {
      const batch = hymnRows.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('hymns')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${hymnRows.length} lines`);
    }

    console.log('✅ All hymns imported successfully!');
    return { success: true, count: insertedCount };

  } catch (error) {
    console.error('❌ Error importing hymns:', error);
    throw error;
  }
};

// Helper function to get a complete hymn by number
export const getHymnFromDatabase = async (hymnNumber: number) => {
  const { data, error } = await supabase
    .from('hymns')
    .select('*')
    .eq('hymn_number', hymnNumber)
    .order('line_number');

  if (error) {
    console.error('Error fetching hymn:', error);
    return null;
  }

  return data;
};

// Helper function to get hymn title (first line)
export const getHymnTitle = async (hymnNumber: number) => {
  const { data, error } = await supabase
    .from('hymns')
    .select('line_content')
    .eq('hymn_number', hymnNumber)
    .eq('line_number', 1)
    .single();

  if (error) {
    console.error('Error fetching hymn title:', error);
    return `Hymn ${hymnNumber}`;
  }

  return data?.line_content || `Hymn ${hymnNumber}`;
};