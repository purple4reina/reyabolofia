// Biographies in three lengths. The press kit offers each with a copy button.
// Keep them evergreen: name years, never "this season" or "recently".

export const bios = {
  short: `Rey Abolofia is Principal Clarinet of the Salem Philharmonia Orchestra and Bass Clarinet with the Sunnyside Symphony Orchestra. A Portland native, he studied at Portland State University and the Eastman School of Music. He has given recitals in the United States, Europe, and Africa, and has taught clarinet in Portland since 2001.`,

  medium: [
    `Rey Abolofia is Principal Clarinet of the Salem Philharmonia Orchestra and Bass Clarinet with the Sunnyside Symphony Orchestra. He has given recitals across the United States, Europe, and Africa. His solo program, The Jewish Clarinet, traces how Jewish composers came to shape classical music in America, and centers on Steve Reich’s New York Counterpoint, performed with ten speakers in a ring around the audience.`,
    `Rey earned his master’s degree in clarinet performance, magna cum laude, at Portland State University, studied at the Eastman School of Music, and pursued doctoral studies at Louisiana State University. He teaches music history on the faculty of Music Camps at Wallowa Lake and has taught clarinet in Portland since 2001.`,
  ],

  long: [
    `Rey Abolofia is Principal Clarinet of the Salem Philharmonia Orchestra and Bass Clarinet with the Sunnyside Symphony Orchestra. He has given recitals across the United States, Europe, and Africa, from the Belgium Clarinet Academy and the Hawaii Music Festival to churches in Zambia’s Eastern Province, where he appeared as a guest artist in 2022.`,
    `His solo program, The Jewish Clarinet, follows four twentieth-century composers (Simeon Bellison, George Gershwin, Darius Milhaud, and Steve Reich) to show how Jewish musicians, long shut out of the church and the court, came to help create the sound of American classical music. Rey introduces each piece from the stage. At the center is Reich’s New York Counterpoint: Rey records ten of its eleven parts in advance and plays the eleventh live, and each recorded part comes from its own speaker in a ring around the audience.`,
    `Rey grew up in Portland, Oregon, and took up the clarinet at ten. He earned his bachelor’s and master’s degrees at Portland State University, the latter magna cum laude, studied at the Eastman School of Music, and pursued doctoral studies at Louisiana State University.`,
    `He is also a historian of the music he plays. His graduate work in musicology centered on fifteenth-century vocal music and the intersection of music theory and mathematics, and he teaches music history on the faculty of Music Camps at Wallowa Lake. He has taught clarinet privately in Portland since 2001, and in 2018 and 2019 taught with the Daraja Music Initiative in Moshi, Tanzania. In 2008 he received Portland State University’s President’s Award for Outstanding Community Engagement, the highest honor conferred by the University President, for his work in public schools, recitals in nursing homes, and dedication to his students.`,
  ],
};

export const wordCount = (text: string | string[]) =>
  (Array.isArray(text) ? text.join(' ') : text).split(/\s+/).filter(Boolean).length;
