# A personal CRA website for British store (Aldi & Lidl, with more to come) receipt parsing.

## Step 1

You upload the image of the receipt you wish to parse

![Step 1](https://firebasestorage.googleapis.com/v0/b/shoppers-34476.appspot.com/o/Step_1.png?alt=media&token=f2aa1a78-9fae-4eec-a81f-31b72149f12a)

## Step 2

The image then gets uploaded onto its Firebase storage server, after which it is sent to Google's Cloud Vision API to be parsed for text relative to the purchase.

![Step 2](https://firebasestorage.googleapis.com/v0/b/shoppers-34476.appspot.com/o/Step_2.png?alt=media&token=9fa12916-91bc-4a91-a12a-b62eb5ad1f35)

## Step 3

After the client receives the data from the receipt, it is neatly put into a general list of items. I can then divide them into three groups: items bought by me, items my girlfriend bought and the items we both paid for (granted, the price is not necessarily split equally)

![Step 3](https://firebasestorage.googleapis.com/v0/b/shoppers-34476.appspot.com/o/Step_3.png?alt=media&token=a3603512-ea56-4cb2-885e-c7c1b0ac03af)

## Step 4

After I am done splitting the items, the webapp splits the total price into two, representing how much each of us ended up paying. The resulting totals can be noted down on Splitwise to make sure we all pay and get paid.

![Step 4](https://firebasestorage.googleapis.com/v0/b/shoppers-34476.appspot.com/o/Step_4.png?alt=media&token=25cf9102-9c00-470d-b582-62d69387f118)
