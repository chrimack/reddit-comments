export interface RedditComment {
  subreddit_id: string;
  link_title: string;
  subreddit: string;
  link_author: string;
  id: string;
  author: string;
  parent_id: string;
  body: string;
  edited: boolean;
  link_permalink: string;
  name: string;
  subreddit_name_prefixed: string;
  created_utc: number;
  link_url: string;
}

export interface RedditCommentChild {
  kind: string;
  data: RedditComment;
}

export interface RedditCommentResponseData {
  after: string | null;
  dist: number;
  modhash: string | null;
  geo_filter: string;
  children: RedditCommentChild[];
  before: string | null;
}

export interface RedditCommentResponse {
  kind: string;
  data: RedditCommentResponseData;
}

// const example = {
//   kind: 'Listing',
//   data: {
//     after: 't1_mzzhsnn',
//     dist: 1,
//     modhash: null,
//     geo_filter: '',
//     children: [
//       {
//         kind: 't1',
//         data: {
//           subreddit_id: 't5_2s3v4',
//           approved_at_utc: null,
//           author_is_blocked: false,
//           comment_type: null,
//           link_title: 'MLB Betting and Picks - 6/26/25 (Thursday)',
//           mod_reason_by: null,
//           banned_by: null,
//           ups: 6,
//           num_reports: null,
//           author_flair_type: 'text',
//           total_awards_received: 0,
//           subreddit: 'sportsbook',
//           link_author: 'sbpotdbot',
//           likes: null,
//           replies: '',
//           user_reports: [],
//           saved: false,
//           id: 'mzzhsnn',
//           banned_at_utc: null,
//           mod_reason_title: null,
//           gilded: 0,
//           archived: false,
//           collapsed_reason_code: null,
//           no_follow: false,
//           author: 'e77754321',
//           num_comments: 546,
//           can_mod_post: false,
//           send_replies: true,
//           parent_id: 't1_mzzhbz4',
//           score: 6,
//           author_fullname: 't2_9px7rgr',
//           over_18: false,
//           report_reasons: null,
//           removal_reason: null,
//           approved_by: null,
//           controversiality: 0,
//           body: 'Well the model is on fire 🔥',
//           edited: false,
//           top_awarded_type: null,
//           downs: 0,
//           author_flair_css_class: null,
//           is_submitter: false,
//           collapsed: false,
//           author_flair_richtext: [],
//           author_patreon_flair: false,
//           body_html:
//             '&lt;div class="md"&gt;&lt;p&gt;Well the model is on fire 🔥&lt;/p&gt;\n' +
//             '&lt;/div&gt;',
//           gildings: {},
//           collapsed_reason: null,
//           distinguished: null,
//           associated_award: null,
//           stickied: false,
//           author_premium: false,
//           can_gild: false,
//           link_id: 't3_1lkocla',
//           unrepliable_reason: null,
//           author_flair_text_color: null,
//           score_hidden: false,
//           permalink:
//             '/r/sportsbook/comments/1lkocla/mlb_betting_and_picks_62625_thursday/mzzhsnn/',
//           subreddit_type: 'public',
//           link_permalink:
//             'https://www.reddit.com/r/sportsbook/comments/1lkocla/mlb_betting_and_picks_62625_thursday/',
//           name: 't1_mzzhsnn',
//           author_flair_template_id: null,
//           subreddit_name_prefixed: 'r/sportsbook',
//           author_flair_text: null,
//           treatment_tags: [],
//           created: 1750986019,
//           created_utc: 1750986019,
//           awarders: [],
//           all_awardings: [],
//           locked: false,
//           author_flair_background_color: null,
//           collapsed_because_crowd_control: null,
//           mod_reports: [],
//           quarantine: false,
//           mod_note: null,
//           link_url:
//             'https://www.reddit.com/r/sportsbook/comments/1lkocla/mlb_betting_and_picks_62625_thursday/',
//         },
//       },
//     ],
//     before: null,
//   },
// };
