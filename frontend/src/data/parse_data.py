import csv
import json

campaigns_csv = """Campaign ID,Campaign Name,Scope,Target Store / Region,SKUs Covered,Channel,Start Date,End Date,Discount Depth %,Spend Amount (INR)
CMP-2026-001,Spring Running Season Kickoff,national,National,"FW-001, FW-002, FW-003",social,2026-03-01,2026-03-20,10,650000
CMP-2026-002,Marathon Pro Store Trial Days,region,West,FW-001,in-store,2026-03-05,2026-03-15,5,180000
CMP-2026-003,Trail Blazer Weekend Feature,region,West,FW-003,email,2026-03-08,2026-03-22,8,210000
CMP-2026-004,Comfort Walk Everyday Push,national,National,FW-005,social,2026-03-12,2026-03-31,10,300000
CMP-2026-005,Grip Trainer Gym Partnership,region,West,FW-004,influencer,2026-03-18,2026-04-05,12,260000
CMP-2026-007,April Fools Flash Sale,national,National,"FW-002, FW-003",social,2026-04-01,2026-04-03,25,300000
CMP-2026-006,Summer Track Nitro Speed Challenge,national,National,"FW-001, FW-002",social,2026-04-10,2026-04-30,15,820000
CMP-2026-008,Marathon Prep Series - Mumbai,local,Mumbai High Street,FW-001,in-store,2026-04-12,2026-04-26,8,150000
CMP-2026-010,Pune Running Club Meetup Sponsorship,local,Pune FC Road,"FW-001, FW-002",local ads,2026-04-18,2026-04-28,10,120000
CMP-2026-011,Ahmedabad Store Anniversary Sale,local,Ahmedabad Palladium,"FW-001, FW-003, FW-004, FW-005",in-store,2026-04-20,2026-05-05,15,200000
CMP-2026-013,Nitro Speed National Push,national,National,FW-002,social,2026-05-01,2026-05-20,12,500000
CMP-2026-014,Summer Trail Adventure Teaser,national,National,FW-003,email,2026-05-05,2026-05-25,10,280000
CMP-2026-015,Grip Trainer Summer Fitness Drive,region,West,FW-004,influencer,2026-05-10,2026-05-31,15,310000
CMP-2026-009,Nitro Running City Blitz (West Region),region,West,"FW-001, FW-002",social,2026-05-15,2026-06-15,15,450000
CMP-2026-012,National Early Monsoon Teaser,national,National,"FW-002, FW-004",email,2026-05-22,2026-06-05,18,540000
CMP-2026-016,West Region Marathon Pro Restock Teaser,region,West,FW-001,email,2026-05-28,2026-06-10,5,90000
CMP-2026-018,Mid-Monsoon Comfort Walk Feature,national,National,FW-005,social,2026-06-01,2026-06-20,12,260000
CMP-2026-019,Grip Trainer Monsoon Gym Push,national,National,FW-004,email,2026-06-08,2026-06-25,10,240000
CMP-2026-023,Trail Blazer Rains Ready Campaign,national,National,FW-003,social,2026-06-15,2026-07-05,15,330000
CMP-2026-024,Pune DC Priority Restock Alert,local,Pune FC Road,FW-001,local ads,2026-06-25,2026-07-10,0,95000
CMP-2026-017,Monsoon Running End of Season Sale,national,National,"FW-001, FW-002, FW-003, FW-004",social,2026-07-01,2026-07-31,20,1200000
CMP-2026-025,July Payday Weekend Sale,national,National,All Catalog,social,2026-07-04,2026-07-06,20,400000
CMP-2026-026,Nitro Speed Mid-Monsoon Refresh,national,National,FW-002,email,2026-07-08,2026-07-22,15,360000
CMP-2026-020,West Region DC Replenishment Hero Push,region,West,FW-001,local ads,2026-07-20,2026-07-31,0,220000
CMP-2026-027,Mumbai Store Restock Celebration,local,Mumbai High Street,FW-001,in-store,2026-07-25,2026-08-02,10,130000
CMP-2026-028,Comfort Walk Rakhi Gifting Teaser,national,National,FW-005,social,2026-07-28,2026-08-09,10,220000
CMP-2026-021,Independence Freedom Run Exclusive,national,National,All Catalog,email,2026-08-01,2026-08-18,18,950000
CMP-2026-029,Grip Trainer Back-to-Fitness Push,national,National,FW-004,influencer,2026-08-05,2026-08-20,12,300000
CMP-2026-030,West Region Marathon Pro Stock Confidence Drive,region,West,"FW-001, FW-002",local ads,2026-08-08,2026-08-22,8,210000
CMP-2026-022,Raksha Bandhan Athletic Gifting Showcase,national,National,"FW-002, FW-004, FW-005",social,2026-08-10,2026-08-25,15,720000
CMP-2026-031,Trail Blazer Monsoon Farewell Sale,national,National,FW-003,social,2026-08-15,2026-08-29,15,280000
CMP-2026-032,August Payday Weekend Flash Sale,national,National,All Catalog,email,2026-08-28,2026-08-31,22,380000"""

reviews_csv = """Review ID,Store ID,SKU ID,Date,Rating (1-5),Sentiment,Fit Related Flag,Review Text
REV-2026-8002,STORE-001,FW-001,2026-03-01,5,positive,NO,"Marathon Pro at Mumbai store — Comfortable out of the box, no break-in period needed."
REV-2026-8013,STORE-001,FW-001,2026-03-01,5,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8015,STORE-005,FW-001,2026-03-01,4,positive,NO,"Marathon Pro at Pune store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8011,STORE-006,FW-002,2026-03-02,4,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8019,STORE-005,FW-001,2026-03-02,4,positive,NO,"Marathon Pro at Pune store — Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8007,STORE-005,FW-003,2026-03-03,5,positive,NO,"Trail Blazer at Pune store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8028,STORE-005,FW-002,2026-03-03,5,positive,NO,"Nitro Speed at Pune store — Comfortable out of the box, no break-in period needed."
REV-2026-8006,STORE-001,FW-001,2026-03-04,5,positive,NO,"Marathon Pro at Mumbai store — Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8023,STORE-001,FW-004,2026-03-04,3,neutral,NO,"Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8030,STORE-001,FW-003,2026-03-04,4,positive,NO,"Trail Blazer at Mumbai store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8029,STORE-005,FW-001,2026-03-05,5,positive,NO,"Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8003,STORE-001,FW-004,2026-03-06,5,positive,NO,"Grip Trainer at Mumbai store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8027,STORE-001,FW-005,2026-03-06,4,positive,YES,"Comfort Walk at Mumbai store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8024,STORE-006,FW-001,2026-03-07,5,positive,NO,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8004,STORE-001,FW-002,2026-03-12,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8018,STORE-005,FW-002,2026-03-15,3,neutral,YES,Nitro Speed at Pune store — Good product but the store took a while to locate my size on the floor.
REV-2026-8021,STORE-001,FW-002,2026-03-15,5,positive,NO,"Nitro Speed at Mumbai store — Exactly the shoe I needed, staff helped me find the right size quickly."
REV-2026-8014,STORE-001,FW-003,2026-03-17,3,neutral,YES,"Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8010,STORE-001,FW-001,2026-03-18,5,positive,NO,"Marathon Pro at Mumbai store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8012,STORE-005,FW-002,2026-03-18,4,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8022,STORE-006,FW-001,2026-03-18,5,positive,NO,"Marathon Pro at Ahmedabad store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8005,STORE-001,FW-002,2026-03-20,3,neutral,YES,"Nitro Speed at Mumbai store — Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8008,STORE-006,FW-003,2026-03-22,5,positive,NO,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8009,STORE-001,FW-005,2026-03-23,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8001,STORE-001,FW-001,2026-03-24,4,positive,NO,"Marathon Pro at Mumbai store — Comfortable out of the box, no break-in period needed."
REV-2026-8026,STORE-006,FW-002,2026-03-24,5,positive,YES,"Been using these for a month now, holding up really well."
REV-2026-8016,STORE-005,FW-001,2026-03-27,4,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8020,STORE-005,FW-001,2026-03-30,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8017,STORE-001,FW-002,2026-03-31,4,positive,NO,"Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8025,STORE-006,FW-002,2026-03-31,5,positive,NO,"Nitro Speed at Ahmedabad store — Been using these for a month now, holding up really well."
REV-2026-8114,STORE-006,FW-003,2026-04-04,5,positive,NO,"Trail Blazer at Ahmedabad store — Perfect for my gym sessions, great grip and support."
REV-2026-8102,STORE-001,FW-003,2026-04-05,1,negative,NO,"Trail Blazer at Mumbai store — Bought a size up since my usual size was unavailable, it pinched my toes during my run. Initiated a return."
REV-2026-8105,STORE-001,FW-005,2026-04-05,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8118,STORE-001,FW-001,2026-04-05,3,neutral,YES,"Comfortable enough, though I expected a bit more cushioning for the price."
REV-2026-8124,STORE-001,FW-004,2026-04-05,4,positive,NO,"Grip Trainer at Mumbai store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8103,STORE-006,FW-001,2026-04-09,5,positive,NO,Marathon Pro at Ahmedabad store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8111,STORE-001,FW-001,2026-04-09,3,neutral,NO,Marathon Pro at Mumbai store — Good product but the store took a while to locate my size on the floor.
REV-2026-8129,STORE-006,FW-001,2026-04-11,4,positive,NO,"Marathon Pro at Ahmedabad store — Perfect for my gym sessions, great grip and support."
REV-2026-8115,STORE-005,FW-001,2026-04-13,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8127,STORE-005,FW-001,2026-04-13,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8122,STORE-005,FW-004,2026-04-14,3,neutral,NO,"Grip Trainer at Pune store — Comfortable enough, though I expected a bit more cushioning for the price."
REV-2026-8125,STORE-005,FW-002,2026-04-14,5,positive,NO,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8101,STORE-001,FW-001,2026-04-15,5,positive,NO,"Marathon Pro at Mumbai store — Comfortable out of the box, no break-in period needed."
REV-2026-8121,STORE-006,FW-001,2026-04-15,5,positive,NO,"Marathon Pro at Ahmedabad store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8123,STORE-006,FW-001,2026-04-16,5,positive,NO,"Exactly the shoe I needed, staff helped me find the right size quickly."
REV-2026-8112,STORE-001,FW-004,2026-04-17,4,positive,NO,"Grip Trainer at Mumbai store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8104,STORE-001,FW-001,2026-04-21,5,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8119,STORE-005,FW-004,2026-04-23,5,positive,NO,"Grip Trainer at Pune store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8113,STORE-001,FW-005,2026-04-24,5,positive,NO,"Comfort Walk at Mumbai store — Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8117,STORE-005,FW-004,2026-04-24,2,negative,YES,"Grip Trainer at Pune store — Bought a size up since my usual size was unavailable, it pinched my toes during my run. Initiated a return."
REV-2026-8130,STORE-005,FW-004,2026-04-24,5,positive,NO,"Grip Trainer at Pune store — Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8110,STORE-001,FW-001,2026-04-25,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8120,STORE-006,FW-004,2026-04-25,3,neutral,YES,Grip Trainer at Ahmedabad store — Had to try a couple of sizes before settling on the right one.
REV-2026-8126,STORE-001,FW-001,2026-04-25,5,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8108,STORE-006,FW-001,2026-04-26,2,negative,YES,"Size curve availability was terrible during peak hours, several other customers had the same problem."
REV-2026-8116,STORE-006,FW-001,2026-04-26,5,positive,NO,"Marathon Pro at Ahmedabad store — Been using these for a month now, holding up really well."
REV-2026-8109,STORE-006,FW-004,2026-04-27,5,positive,NO,"Grip Trainer at Ahmedabad store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8106,STORE-001,FW-002,2026-04-28,2,negative,YES,Nitro Speed at Mumbai store — Had to settle for a size that didn't fit because my true size was missing from the shelf.
REV-2026-8107,STORE-006,FW-005,2026-04-30,4,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8128,STORE-006,FW-005,2026-04-30,5,positive,NO,Comfort Walk at Ahmedabad store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8214,STORE-001,FW-002,2026-05-02,5,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8228,STORE-001,FW-004,2026-05-02,4,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8219,STORE-006,FW-002,2026-05-03,4,positive,NO,"Nitro Speed at Ahmedabad store — Exactly the shoe I needed, staff helped me find the right size quickly."
REV-2026-8206,STORE-006,FW-002,2026-05-06,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8226,STORE-001,FW-001,2026-05-06,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8212,STORE-001,FW-001,2026-05-07,5,positive,NO,"Marathon Pro at Mumbai store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8234,STORE-005,FW-002,2026-05-07,5,positive,NO,"Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8201,STORE-006,FW-001,2026-05-08,4,positive,NO,"Marathon Pro at Ahmedabad store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8230,STORE-001,FW-001,2026-05-08,4,positive,NO,"Marathon Pro at Mumbai store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8225,STORE-001,FW-002,2026-05-09,4,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8227,STORE-006,FW-001,2026-05-09,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8220,STORE-005,FW-002,2026-05-10,5,positive,NO,"Nitro Speed at Pune store — Been using these for a month now, holding up really well."
REV-2026-8222,STORE-006,FW-001,2026-05-10,5,positive,NO,"Marathon Pro at Ahmedabad store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8205,STORE-001,FW-001,2026-05-11,3,neutral,YES,"Marathon Pro at Mumbai store — Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8208,STORE-006,FW-002,2026-05-11,4,positive,NO,"Nitro Speed at Ahmedabad store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8235,STORE-001,FW-002,2026-05-13,3,neutral,YES,"Nitro Speed at Mumbai store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8217,STORE-001,FW-001,2026-05-14,3,neutral,YES,"Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8218,STORE-006,FW-001,2026-05-14,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8229,STORE-001,FW-002,2026-05-15,3,neutral,YES,Had to try a couple of sizes before settling on the right one.
REV-2026-8211,STORE-005,FW-001,2026-05-16,3,neutral,YES,Marathon Pro at Pune store — Had to try a couple of sizes before settling on the right one.
REV-2026-8215,STORE-001,FW-001,2026-05-16,5,positive,NO,Marathon Pro at Mumbai store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8231,STORE-005,FW-001,2026-05-16,2,negative,YES,Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating.
REV-2026-8223,STORE-001,FW-001,2026-05-18,5,positive,YES,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8203,STORE-001,FW-002,2026-05-19,3,neutral,YES,"Nitro Speed at Mumbai store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8207,STORE-006,FW-002,2026-05-19,3,neutral,NO,"Nitro Speed at Ahmedabad store — Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8216,STORE-001,FW-001,2026-05-19,3,neutral,YES,"Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8213,STORE-001,FW-002,2026-05-20,3,neutral,YES,Nitro Speed at Mumbai store — Good product but the store took a while to locate my size on the floor.
REV-2026-8210,STORE-005,FW-003,2026-05-21,5,positive,NO,Trail Blazer at Pune store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8224,STORE-005,FW-001,2026-05-22,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8233,STORE-005,FW-004,2026-05-22,5,positive,NO,"Grip Trainer at Pune store — Been using these for a month now, holding up really well."
REV-2026-8202,STORE-005,FW-001,2026-05-25,3,neutral,YES,"Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8221,STORE-001,FW-003,2026-05-26,4,positive,NO,"Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8232,STORE-006,FW-004,2026-05-26,5,positive,NO,"Grip Trainer at Ahmedabad store — Comfortable out of the box, no break-in period needed."
REV-2026-8204,STORE-005,FW-001,2026-05-28,3,neutral,YES,Had to try a couple of sizes before settling on the right one.
REV-2026-8236,STORE-005,FW-002,2026-05-28,3,neutral,YES,"Nitro Speed at Pune store — Comfortable enough, though I expected a bit more cushioning for the price."
REV-2026-8209,STORE-001,FW-001,2026-05-29,3,neutral,YES,"Marathon Pro at Mumbai store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8306,STORE-001,FW-001,2026-06-01,3,neutral,YES,"Marathon Pro at Mumbai store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8315,STORE-006,FW-001,2026-06-01,5,positive,NO,"Marathon Pro at Ahmedabad store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8325,STORE-005,FW-001,2026-06-01,2,negative,YES,Marathon Pro at Pune store — Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating.
REV-2026-8334,STORE-001,FW-001,2026-06-01,2,negative,YES,Marathon Pro at Mumbai store — Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating.
REV-2026-8346,STORE-001,FW-001,2026-06-02,2,negative,YES,UK 8 was out of stock so the salesperson pushed me toward a different size. It didn't fit well.
REV-2026-8360,STORE-001,FW-001,2026-06-02,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8313,STORE-006,FW-003,2026-06-03,4,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8320,STORE-006,FW-004,2026-06-03,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8326,STORE-001,FW-001,2026-06-03,2,negative,YES,"Marathon Pro at Mumbai store — Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
REV-2026-8329,STORE-006,FW-001,2026-06-03,5,positive,NO,"Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8319,STORE-001,FW-005,2026-06-04,2,negative,YES,"Comfort Walk at Mumbai store — Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
REV-2026-8330,STORE-005,FW-002,2026-06-04,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8348,STORE-001,FW-001,2026-06-04,5,positive,YES,"Marathon Pro at Mumbai store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8342,STORE-001,FW-001,2026-06-06,2,negative,YES,"Bought a size up since my usual size was unavailable, it pinched my toes during my run. Initiated a return."
REV-2026-8321,STORE-001,FW-005,2026-06-07,3,neutral,YES,"Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8303,STORE-001,FW-002,2026-06-08,1,negative,YES,Nitro Speed at Mumbai store — UK 8 was out of stock so the salesperson pushed me toward a different size. It didn't fit well.
REV-2026-8343,STORE-005,FW-003,2026-06-08,1,negative,YES,Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability.
REV-2026-8310,STORE-005,FW-001,2026-06-09,3,neutral,YES,"Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8322,STORE-005,FW-003,2026-06-09,3,neutral,YES,"Trail Blazer at Pune store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8336,STORE-005,FW-001,2026-06-09,2,negative,YES,Marathon Pro at Pune store — Second time this month the store doesn't have my size in Marathon Pro. Getting frustrating.
REV-2026-8304,STORE-006,FW-001,2026-06-10,5,positive,NO,"Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8302,STORE-006,FW-004,2026-06-11,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8349,STORE-006,FW-001,2026-06-12,5,positive,NO,"Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8337,STORE-001,FW-002,2026-06-13,5,positive,YES,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8339,STORE-005,FW-002,2026-06-13,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8316,STORE-005,FW-004,2026-06-14,4,positive,YES,Grip Trainer at Pune store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8340,STORE-005,FW-002,2026-06-14,3,neutral,YES,Nitro Speed at Pune store — Good product but the store took a while to locate my size on the floor.
REV-2026-8341,STORE-001,FW-002,2026-06-14,4,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8317,STORE-001,FW-004,2026-06-15,5,positive,NO,"Grip Trainer at Mumbai store — Comfortable out of the box, no break-in period needed."
REV-2026-8345,STORE-001,FW-005,2026-06-15,4,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8359,STORE-001,FW-001,2026-06-15,3,neutral,YES,"Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8318,STORE-001,FW-001,2026-06-16,5,positive,NO,"Marathon Pro at Mumbai store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8338,STORE-005,FW-001,2026-06-16,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8312,STORE-001,FW-001,2026-06-17,2,negative,YES,"Size curve availability was terrible during peak hours, several other customers had the same problem."
REV-2026-8324,STORE-005,FW-001,2026-06-17,1,negative,YES,Had to settle for a size that didn't fit because my true size was missing from the shelf.
REV-2026-8314,STORE-001,FW-003,2026-06-18,4,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8350,STORE-005,FW-001,2026-06-18,2,negative,YES,"Marathon Pro at Pune store — Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
REV-2026-8311,STORE-005,FW-001,2026-06-19,2,negative,YES,"Size curve availability was terrible during peak hours, several other customers had the same problem."
REV-2026-8323,STORE-001,FW-001,2026-06-19,1,negative,YES,"Visited specifically for Marathon Pro in UK 9 but the shelf was empty, staff said out of stock. Left without buying."
REV-2026-8331,STORE-006,FW-002,2026-06-19,5,positive,NO,"Nitro Speed at Ahmedabad store — Been using these for a month now, holding up really well."
REV-2026-8332,STORE-005,FW-001,2026-06-19,2,negative,YES,"Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
REV-2026-8357,STORE-006,FW-001,2026-06-19,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8309,STORE-005,FW-002,2026-06-20,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8335,STORE-001,FW-001,2026-06-20,1,negative,YES,"Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
REV-2026-8307,STORE-006,FW-001,2026-06-23,2,negative,YES,Had to settle for a size that didn't fit because my true size was missing from the shelf.
REV-2026-8308,STORE-001,FW-001,2026-06-23,3,neutral,NO,"Marathon Pro at Mumbai store — Comfortable enough, though I expected a bit more cushioning for the price."
REV-2026-8351,STORE-001,FW-001,2026-06-23,2,negative,YES,UK 8.5 was out of stock so the salesperson pushed me toward a different size. It didn't fit well.
REV-2026-8328,STORE-001,FW-003,2026-06-24,4,positive,NO,"Trail Blazer at Mumbai store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8352,STORE-001,FW-001,2026-06-24,2,negative,YES,"Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
REV-2026-8354,STORE-005,FW-001,2026-06-24,1,negative,YES,"Returning my pair, had to buy a half size larger because the right size was out of stock and it hurt my heel."
REV-2026-8333,STORE-005,FW-001,2026-06-25,3,neutral,YES,"Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8344,STORE-001,FW-003,2026-06-25,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8353,STORE-001,FW-005,2026-06-25,5,positive,NO,"Comfort Walk at Mumbai store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8301,STORE-006,FW-005,2026-06-26,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8327,STORE-001,FW-001,2026-06-26,1,negative,NO,"Marathon Pro at Mumbai store — Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
REV-2026-8356,STORE-006,FW-002,2026-06-26,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8305,STORE-005,FW-001,2026-06-28,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8358,STORE-001,FW-001,2026-06-28,1,negative,YES,"Store was out of my usual size, tried to squeeze into a smaller one but gave up and left."
REV-2026-8347,STORE-001,FW-002,2026-06-29,3,neutral,NO,Had to try a couple of sizes before settling on the right one.
REV-2026-8355,STORE-001,FW-002,2026-06-29,3,neutral,YES,"Nitro Speed at Mumbai store — Comfortable enough, though I expected a bit more cushioning for the price."
REV-2026-8416,STORE-001,FW-005,2026-07-02,5,positive,NO,"Comfort Walk at Mumbai store — Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8435,STORE-001,FW-002,2026-07-02,5,positive,NO,"Nitro Speed at Mumbai store — Comfortable out of the box, no break-in period needed."
REV-2026-8422,STORE-005,FW-002,2026-07-03,5,positive,NO,"Nitro Speed at Pune store — Comfortable out of the box, no break-in period needed."
REV-2026-8429,STORE-005,FW-001,2026-07-03,2,negative,YES,Marathon Pro at Pune store — Ended up buying online because the store never had my size in stock for over two weeks.
REV-2026-8433,STORE-006,FW-002,2026-07-03,2,negative,NO,Nitro Speed at Ahmedabad store — Had to settle for a size that didn't fit because my true size was missing from the shelf.
REV-2026-8403,STORE-005,FW-002,2026-07-04,3,neutral,YES,"Nitro Speed at Pune store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8415,STORE-005,FW-005,2026-07-05,3,neutral,YES,"Comfort Walk at Pune store — Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8421,STORE-001,FW-001,2026-07-05,5,positive,NO,"Marathon Pro at Mumbai store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8437,STORE-005,FW-001,2026-07-05,5,positive,NO,Marathon Pro at Pune store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8438,STORE-006,FW-002,2026-07-05,5,positive,NO,"Nitro Speed at Ahmedabad store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8405,STORE-001,FW-002,2026-07-08,4,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8431,STORE-005,FW-001,2026-07-08,4,positive,NO,"Marathon Pro at Pune store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8445,STORE-001,FW-002,2026-07-08,2,negative,YES,Nitro Speed at Mumbai store — Ended up buying online because the store never had my size in stock for over two weeks.
REV-2026-8413,STORE-001,FW-003,2026-07-10,5,positive,NO,"Trail Blazer at Mumbai store — Been using these for a month now, holding up really well."
REV-2026-8420,STORE-005,FW-001,2026-07-10,2,negative,NO,"Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
REV-2026-8446,STORE-006,FW-003,2026-07-10,5,positive,NO,"Perfect for my gym sessions, great grip and support."
REV-2026-8417,STORE-001,FW-001,2026-07-11,1,negative,YES,Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability.
REV-2026-8423,STORE-005,FW-001,2026-07-11,2,negative,YES,"Store was out of my usual size, tried to squeeze into a smaller one but gave up and left."
REV-2026-8407,STORE-001,FW-004,2026-07-12,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8425,STORE-001,FW-003,2026-07-12,2,negative,YES,"Size curve availability was terrible during peak hours, several other customers had the same problem."
REV-2026-8414,STORE-006,FW-001,2026-07-14,4,positive,NO,"Marathon Pro at Ahmedabad store — Perfect for my gym sessions, great grip and support."
REV-2026-8440,STORE-001,FW-003,2026-07-14,5,positive,NO,"Trail Blazer at Mumbai store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8409,STORE-001,FW-004,2026-07-15,4,positive,NO,Grip Trainer at Mumbai store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8402,STORE-006,FW-003,2026-07-16,4,positive,YES,"Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8410,STORE-001,FW-004,2026-07-16,5,positive,NO,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8428,STORE-001,FW-003,2026-07-16,3,neutral,YES,Trail Blazer at Mumbai store — Good product but the store took a while to locate my size on the floor.
REV-2026-8406,STORE-005,FW-002,2026-07-17,5,positive,YES,"Perfect for my gym sessions, great grip and support."
REV-2026-8443,STORE-001,FW-001,2026-07-17,2,negative,YES,Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability.
REV-2026-8426,STORE-001,FW-001,2026-07-18,5,positive,NO,"Marathon Pro at Mumbai store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8439,STORE-005,FW-004,2026-07-19,5,positive,NO,"Grip Trainer at Pune store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8441,STORE-006,FW-004,2026-07-19,4,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8434,STORE-005,FW-004,2026-07-22,5,positive,NO,"Grip Trainer at Pune store — Perfect for my gym sessions, great grip and support."
REV-2026-8442,STORE-006,FW-001,2026-07-22,5,positive,NO,Marathon Pro at Ahmedabad store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8418,STORE-001,FW-004,2026-07-23,5,positive,NO,"Grip Trainer at Mumbai store — Been using these for a month now, holding up really well."
REV-2026-8419,STORE-001,FW-001,2026-07-23,4,positive,NO,"Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8412,STORE-006,FW-002,2026-07-26,5,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8401,STORE-001,FW-005,2026-07-27,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8408,STORE-001,FW-002,2026-07-27,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8427,STORE-005,FW-002,2026-07-27,1,negative,YES,"Substituted size didn't work out, requesting an exchange once the correct size is back in stock."
REV-2026-8436,STORE-005,FW-002,2026-07-27,2,negative,YES,Nitro Speed at Pune store — UK 9.5 was out of stock so the salesperson pushed me toward a different size. It didn't fit well.
REV-2026-8430,STORE-006,FW-001,2026-07-28,5,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8404,STORE-005,FW-001,2026-07-29,5,positive,NO,"Marathon Pro at Pune store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8411,STORE-001,FW-001,2026-07-29,5,positive,NO,"Marathon Pro at Mumbai store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8432,STORE-006,FW-004,2026-07-30,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8424,STORE-005,FW-001,2026-07-31,5,positive,NO,"Marathon Pro at Pune store — Comfortable out of the box, no break-in period needed."
REV-2026-8444,STORE-005,FW-001,2026-07-31,5,positive,NO,"Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8524,STORE-005,FW-005,2026-08-02,5,positive,NO,"Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8510,STORE-006,FW-005,2026-08-03,5,positive,YES,"Comfort Walk at Ahmedabad store — Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8515,STORE-001,FW-002,2026-08-03,5,positive,YES,"Comfortable out of the box, no break-in period needed."
REV-2026-8520,STORE-005,FW-005,2026-08-03,5,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8503,STORE-006,FW-001,2026-08-04,5,positive,NO,"Exactly the shoe I needed, staff helped me find the right size quickly."
REV-2026-8537,STORE-005,FW-001,2026-08-06,4,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8518,STORE-001,FW-001,2026-08-07,5,positive,YES,"Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8513,STORE-005,FW-005,2026-08-08,4,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8528,STORE-001,FW-003,2026-08-08,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8529,STORE-006,FW-003,2026-08-08,5,positive,NO,"Exactly the shoe I needed, staff helped me find the right size quickly."
REV-2026-8511,STORE-001,FW-002,2026-08-09,5,positive,NO,"Nitro Speed at Mumbai store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8530,STORE-001,FW-004,2026-08-09,5,positive,NO,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8512,STORE-005,FW-001,2026-08-10,4,positive,NO,"Replenishment finally came through, picked up my usual size without any hassle."
REV-2026-8509,STORE-005,FW-004,2026-08-11,5,positive,NO,"Grip Trainer at Pune store — Store had my exact size in stock, walked out happy in under 5 minutes."
REV-2026-8534,STORE-006,FW-004,2026-08-11,4,positive,NO,Great fit and super comfortable cushioning for my daily runs.
REV-2026-8517,STORE-005,FW-001,2026-08-14,5,positive,YES,"Been using these for a month now, holding up really well."
REV-2026-8516,STORE-005,FW-001,2026-08-15,4,positive,NO,"Marathon Pro at Pune store — Picked this up as a gift, packaging and quality were excellent."
REV-2026-8522,STORE-005,FW-002,2026-08-15,5,positive,NO,"Replenishment finally came through, picked up my usual size without any hassle."
REV-2026-8519,STORE-001,FW-005,2026-08-16,2,negative,YES,Comfort Walk at Mumbai store — Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability.
REV-2026-8531,STORE-006,FW-004,2026-08-16,4,positive,NO,Grip Trainer at Ahmedabad store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8526,STORE-001,FW-005,2026-08-17,2,negative,YES,"Visited specifically for Comfort Walk in UK 9 but the shelf was empty, staff said out of stock. Left without buying."
REV-2026-8539,STORE-001,FW-004,2026-08-17,5,positive,YES,Store is fully stocked again! Got my exact size within minutes. Best experience in a while.
REV-2026-8514,STORE-005,FW-003,2026-08-18,5,positive,NO,Store is fully stocked again! Got my exact size within minutes. Best experience in a while.
REV-2026-8540,STORE-005,FW-002,2026-08-18,5,positive,YES,"Nitro Speed at Pune store — Replenishment finally came through, picked up my usual size without any hassle."
REV-2026-8505,STORE-005,FW-005,2026-08-19,4,positive,NO,"Stock situation has clearly improved, staff confirmed a fresh shipment arrived this week."
REV-2026-8507,STORE-006,FW-005,2026-08-19,5,positive,NO,"Comfort Walk at Ahmedabad store — Well stocked store, friendly staff, got the color and size I wanted."
REV-2026-8535,STORE-001,FW-001,2026-08-19,3,neutral,YES,"Marathon Pro at Mumbai store — Fit is okay, slightly snug in the midfoot, needed some guidance from staff."
REV-2026-8504,STORE-006,FW-005,2026-08-21,5,positive,NO,Good news - my size is back in stock. Bought two pairs this time just in case.
REV-2026-8533,STORE-001,FW-001,2026-08-21,5,positive,NO,"Comfortable out of the box, no break-in period needed."
REV-2026-8527,STORE-005,FW-005,2026-08-22,3,neutral,YES,"Comfort Walk at Pune store — Comfortable enough, though I expected a bit more cushioning for the price."
REV-2026-8536,STORE-006,FW-002,2026-08-22,5,positive,NO,"Been using these for a month now, holding up really well."
REV-2026-8501,STORE-006,FW-001,2026-08-23,4,positive,NO,Marathon Pro at Ahmedabad store — Store is fully stocked again! Got my exact size within minutes. Best experience in a while.
REV-2026-8502,STORE-001,FW-003,2026-08-23,3,neutral,YES,Trail Blazer at Mumbai store — Had to try a couple of sizes before settling on the right one.
REV-2026-8521,STORE-001,FW-003,2026-08-24,4,positive,NO,"Trail Blazer at Mumbai store — Fantastic cushioning, wore them for my long run this weekend and no complaints."
REV-2026-8508,STORE-005,FW-002,2026-08-28,3,neutral,YES,"Nitro Speed at Pune store — Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8538,STORE-005,FW-001,2026-08-28,4,positive,YES,Marathon Pro at Pune store — Great fit and super comfortable cushioning for my daily runs.
REV-2026-8523,STORE-005,FW-003,2026-08-29,3,neutral,YES,"Decent shoe overall, had to wait a bit while staff checked the backroom for my size."
REV-2026-8506,STORE-001,FW-005,2026-08-30,4,positive,NO,"Loved the design and grip, would definitely recommend to fellow runners."
REV-2026-8525,STORE-001,FW-005,2026-08-30,5,positive,NO,"Picked this up as a gift, packaging and quality were excellent."
REV-2026-8532,STORE-006,FW-004,2026-08-30,4,positive,NO,"Grip Trainer at Ahmedabad store — Store had my exact size in stock, walked out happy in under 5 minutes."
"""

# Parse campaigns
campaigns_reader = csv.DictReader(campaigns_csv.strip().splitlines())
campaigns_data = []
for row in campaigns_reader:
    skus_raw = row['SKUs Covered'].strip()
    if skus_raw == 'All Catalog':
        sku_scope = None
    elif ',' in skus_raw:
        sku_scope = [s.strip() for s in skus_raw.split(',')]
    else:
        sku_scope = [skus_raw]

    scope_val = row['Scope'].strip().lower()
    target_geo = row['Target Store / Region'].strip()
    store_id = None
    region = None
    if scope_val in ['local', 'store']:
        if 'mumbai' in target_geo.lower():
            store_id = 'STORE-001'
            region = 'West'
        elif 'pune' in target_geo.lower():
            store_id = 'STORE-005'
            region = 'West'
        elif 'ahmedabad' in target_geo.lower():
            store_id = 'STORE-006'
            region = 'West'
        else:
            store_id = target_geo
    elif scope_val == 'region':
        region = target_geo

    campaigns_data.append({
        'campaign_id': row['Campaign ID'].strip(),
        'campaign_name': row['Campaign Name'].strip(),
        'scope': scope_val,
        'store_id': store_id,
        'region': region,
        'sku_scope': sku_scope,
        'channel': row['Channel'].strip(),
        'start_date': row['Start Date'].strip(),
        'end_date': row['End Date'].strip(),
        'discount_depth_pct': float(row['Discount Depth %'].strip()),
        'spend_amount': float(row['Spend Amount (INR)'].strip()),
    })

# Parse reviews
reviews_reader = csv.DictReader(reviews_csv.strip().splitlines())
reviews_data = []
for row in reviews_reader:
    fit_flag = row['Fit Related Flag'].strip().upper() == 'YES'
    reviews_data.append({
        'review_id': row['Review ID'].strip(),
        'store_id': row['Store ID'].strip(),
        'sku_id': row['SKU ID'].strip(),
        'date': row['Date'].strip(),
        'rating': int(row['Rating (1-5)'].strip()),
        'sentiment': row['Sentiment'].strip().lower(),
        'fit_related_flag': fit_flag,
        'review_text': row['Review Text'].strip(),
    })

print(f"Parsed {len(campaigns_data)} campaigns and {len(reviews_data)} reviews.")

with open('d:/SoleSight/frontend/src/data/parsed_campaigns.json', 'w') as f:
    json.dump(campaigns_data, f, indent=2)

with open('d:/SoleSight/frontend/src/data/parsed_reviews.json', 'w') as f:
    json.dump(reviews_data, f, indent=2)
