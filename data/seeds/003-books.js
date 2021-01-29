exports.seed = (knex) =>
  // Deletes ALL existing entries
  knex('books')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('books').insert([
        {
          // id: 0,
          google_id: '-w3TCwAAQBAJ',
          title: 'Hamlet',
          cover_image:
            'https://books.google.com/books/content?id=-w3TCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          description:
            "<b>The acclaimed Pelican Shakespeare series, now in a dazzling new series design <p>Winner of the 2016 AIGA + Design Observer 50 Books 50 Covers competition <p><b>Gold Medal Winner of the 3x3 Illustration Annual No. 14</b></b> <p>This edition of <i>Hamlet</i> is edited with an introduction by series editor A. R. Braunmuller and was recently repackaged with cover art by Manuja Waldia. Waldia received a Gold Medal from the Society of Illustrators for the Pelican Shakespeare series. <p> The legendary Pelican Shakespeare series features authoritative and meticulously researched texts paired with scholarship by renowned Shakespeareans. Each book includes an essay on the theatrical world of Shakespeare's time, an introduction to the individual play, and a detailed note on the text used. Updated by general editors Stephen Orgel and A. R. Braunmuller, these easy-to-read editions incorporate over thirty years of Shakespeare scholarship undertaken since the original series, edited by Alfred Harbage, appeared between 1956 and 1967. With stunning new covers, definitive texts, and illuminating essays, the Pelican Shakespeare will remain a valued resource for students, teachers, and theater professionals for many years to come. <p>For more than seventy years, Penguin has been the leading publisher of classic literature in the English-speaking world. With more than 1,700 titles, Penguin Classics represents a global bookshelf of the best works throughout history and across genres and disciplines. Readers trust the series to provide authoritative texts enhanced by introductions and notes by distinguished scholars and contemporary authors, as well as up-to-date translations by award-winning translators.",
          page_count: 148
        },
        {
          // id: 1,
          google_id: 'XV8XAAAAYAAJ',
          title: 'Moby Dick',
          cover_image:
            'http://books.google.com/books/content?id=XV8XAAAAYAAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE717yZr3VHCetmyT-EIKTmEFPqPWiF8pLeBJvHi4kEEmDv5Scmjggtujv_GdCZSCV9mFxSOWgjkR5y4_-6EjzARartb6hbYneQwaMtb0XJYWUCKCnZrD2F2MHK3W070eRHqEWEiP&source=gbs_api',
          description:
            "A literary classic that wasn't recognized for its merits until decades after its publication, Herman Melville's Moby-Dick tells the tale of a whaling ship and its crew, who are carried progressively further out to sea by the fiery Captain Ahab. Obsessed with killing the massive whale, which had previously bitten off Ahab's leg, the seasoned seafarer steers his ship to confront the creature, while the rest of the shipmates, including the young narrator, Ishmael, and the harpoon expert, Queequeg, must contend with their increasingly dire journey. The book invariably lands on any short list of the greatest American novels.",
          page_count: 545
        },
        {
          // id: 2,
          google_id: 'XTtVMOa0azk',
          title:
            'Turn Right at Machu Picchu: Rediscovering the Lost City One Step at a Time',
          cover_image: '',
          description:
            'THE NEW YORK TIMES BESTSELLER! What happens when an unadventurous adventure writer tries to re-create the original expedition to Machu Picchu? In 1911, Hiram Bingham III climbed into the Andes Mountains of Peru and “discovered” Machu Picchu. While history has recast Bingham as a villain who stole both priceless artifacts and credit for finding the great archeological site, Mark Adams set out to retrace the explorer’s perilous path in search of the truth—except he’d written about adventure far more than he’d actually lived it. In fact, he’d never even slept in a tent. Turn Right at Machu Picchu is Adams’ fascinating and funny account of his journey through some of the world’s most majestic, historic, and remote landscapes guided only by a hard-as-nails Australian survivalist and one nagging question: Just what was Machu Picchu?',
          page_count: 352
        },
        {
          // id: 3,
          google_id: 'ZgfbDwAAQBAJ',
          title: 'The Big Sleep',
          cover_image:
            'https://books.google.com/books/content?id=ZgfbDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          description:
            "The Big Sleep and (1939 and ) is a hardboiled crime novel by Raymond Chandler, the first to feature the detective Philip Marlowe. It has been adapted for film twice, in 1946 and again in 1978. The story is set in Los Angeles The story is noted for its complexity, with characters double-crossing one another and secrets being exposed throughout the narrative. The title is a euphemism for death; the final pages of the book refer to a rumination about and quot;sleeping the big sleep and quot;. In 1999, the book was voted 96th of Le Monde and 's and quot;100 Books of the Century and quot;. In 2005, it was included in Time magazine and 's and quot;List of the 100 Best Novels and quot;.",
          page_count: 173
        }
      ])
    )
