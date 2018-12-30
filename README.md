# concertina
Concertina Path finder


This scripts searches for a way to play a (irish) tune on a concertina

It needs an .abc file as input. Output is a series of buttons, with push/pull added. 
https://thesession.org/  had many .abc files, but therae are many other sites. 

For plotting results, chunky_png is needed. 


Please note:  
 1. $tinakeys  depends on YOUR concertina. The note of the buttons on yours can be different from mine!
 
 2. this scripts only plots one winner; 
 a few lines earlier you see what possible minor variantions are worth trying:
 the notes with '??' have more options. You see option button 25 of 28 to play A2:
  - 28 is in 12 routes, 
  - 25 in 2 routes.
 the notes with OK are pretty sure about. 
 
these 14 are the best routes for Patsy Gearys (listen to Bothy Band):

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{10=>14}{10=>"LC1-PUSH=G2"}

OK:{27=>14}{27=>"LG4-PULL=F#2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{27=>14}{27=>"LG4-PULL=F#2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

OK:{32=>14}{32=>"RT2-PUSH=C#3"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{10=>14}{10=>"LC1-PUSH=G2"}

OK:{27=>14}{27=>"LG4-PULL=F#2"}

??:{25=>2, 28=>12}{25=>"LC1-PULL=A2", 28=>"LG3-PULL=A2"}

??:{52=>2, 15=>12}{52=>"RC2-PULL=D3", 15=>"LG1-PUSH=D3"}

??:{37=>2, 30=>12}{37=>"RC2-PUSH=E3", 30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{41=>14}{41=>"RG1-PUSH=G3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{41=>14}{41=>"RG1-PUSH=G3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{15=>14}{15=>"LG1-PUSH=D3"}

??:{51=>12, 14=>2}{51=>"RC1-PULL=B2", 14=>"LG2-PUSH=B2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{27=>14}{27=>"LG4-PULL=F#2"}

OK:{12=>14}{12=>"LG4-PUSH=D2"}

OK:{9=>14}{9=>"LC2-PUSH=E2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{10=>14}{10=>"LC1-PUSH=G2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

??:{25=>7, 28=>7}{25=>"LC1-PULL=A2", 28=>"LG3-PULL=A2"}

??:{37=>7, 30=>7}{37=>"RC2-PUSH=E3", 30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{15=>14}{15=>"LG1-PUSH=D3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{41=>14}{41=>"RG1-PUSH=G3"}

??:{57=>10, 54=>4}{57=>"RG2-PULL=A3", 54=>"RC4-PULL=A3"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{27=>14}{27=>"LG4-PULL=F#2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

OK:{51=>14}{51=>"RC1-PULL=B2"}

OK:{25=>14}{25=>"LC1-PULL=A2"}

??:{51=>12, 14=>2}{51=>"RC1-PULL=B2", 14=>"LG2-PUSH=B2"}

OK:{15=>14}{15=>"LG1-PUSH=D3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{15=>14}{15=>"LG1-PUSH=D3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{57=>14}{57=>"RG2-PULL=A3"}

OK:{42=>14}{42=>"RG2-PUSH=B3"}

OK:{57=>14}{57=>"RG2-PULL=A3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

??:{57=>10, 54=>4}{57=>"RG2-PULL=A3", 54=>"RC4-PULL=A3"}

OK:{56=>14}{56=>"RG1-PULL=F#3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{15=>14}{15=>"LG1-PUSH=D3"}

OK:{30=>14}{30=>"LG1-PULL=E3"}

OK:{15=>14}{15=>"LG1-PUSH=D3"}

