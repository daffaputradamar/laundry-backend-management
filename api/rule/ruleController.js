const Rule = require('./ruleModel')

module.exports = {
    index: (req, res) => {
        if (req.user.role == 'admin') {
            Rule.find()
                .then(rule => res.json(rule))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'admin') {
            Rule.findById(req.params.id)
                .then(rule => res.json(rule))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin') {
            Rule.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(rule => res.json(rule))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin') {
            Rule.create({ ...req.body })
                .then(rule => res.json(rule))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin') {
            Rule.findOneAndDelete({ _id: req.params.id })
                .then(rule => res.json(rule))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    diskon: async (req, res) => {
        const { f, b } = req.query
        rules = await Rule.find()
        const rule = rules[0]
        const frekuensi = f
        const bayar = b

        const fj = rule.freqlow //frekuensi jarang
        const fs = rule.freqmiddle // frekuensi sedang
        const ft = rule.freqhigh // frekuensi tinggi

        const fjmin = fj
        const fjmax = fs
        const fsmin = fj
        const fsmax = ft
        const ftmin = fs
        const ftmax = ft

        const br = rule.paylow // bayar rendah
        const bs = rule.paymiddle // bayar sedang
        const bb = rule.payhigh // bayar banyak

        const brmin = br
        const brmax = bs
        const bsmin = br
        const bsmax = bb
        const bbmin = bs
        const bbmax = bb

        const dr = rule.discountlow // diskon rendah
        const ds = rule.discountmiddle // diskon sedang
        const dt = rule.discounthigh // diskon tinggi

        const drmin = dr
        const drmax = ds
        const dsmin = dr
        const dsmax = dt
        const dtmin = ds
        const dtmax = dt

        // fuzzifikasi

        let frekRendah = function(fr) {
            //fr = frekuensi rendah
            if (fr <= fjmin) {
                return (fr = 1)
            } else if (fr >= fjmin && fr <= fjmax) {
                return (fr = (fjmax - fr) / (fjmax - fjmin))
            } else if (fr >= fjmax) {
                return (fr = 0)
            }
        }
        //frekRendah(frekuensi);

        let frekSedang = function(fsd) {
            //fsd = frekuensi sedang
            if (fsd <= fsmin || fsd >= fsmax) {
                return (fsd = 0)
            } else if (fsd >= fsmin && fsd <= (fsmin + fsmax) / 2) {
                return (fsd = (fsd - fsmin) / ((fsmin + fsmax) / 2 - fsmin))
            } else if (fsd >= (fsmin + fsmax) / 2 && fsd <= fsmax) {
                return (fsd = (fsmax - fsd) / (fsmax - (fsmin + fsmax) / 2))
            }
        }
        //frekSedang(frekuensi);

        let frekTinggi = function(ftg) {
            //ftg = frekuensi tinggi
            if (ftg <= ftmin) {
                return (ftg = 0)
            } else if (ftg >= ftmin && ftg <= ftmax) {
                return (ftg = (ftg - ftmin) / (ftmax - ftmin))
            } else if (ftg >= ftmax) {
                return (ftg = 1)
            }
        }
        //frekTinggi(frekuensi);

        let byrRendah = function(brd) {
            //brd = bayar rendah
            if (brd <= brmin) {
                return (brd = 1)
            } else if (brd >= brmin && brd <= brmax) {
                return (brd = (brmax - brd) / (brmax - brmin))
            } else if (brd >= brmax) {
                return (brd = 0)
            }
        }
        //byrRendah(bayar);

        let byrSedang = function(bsd) {
            //bsd = bayar sedang
            if (bsd <= brmin || bsd >= bsmax) {
                return (bsd = 0)
            } else if (bsd >= bsmin && bsd <= (bsmin + bsmax) / 2) {
                return (bsd = (bsd - bsmin) / ((bsmin + bsmax) / 2 - bsmin))
            } else if (bsd >= (bsmin + bsmax) / 2 && bsd <= bsmax) {
                return (bsd = (bsmax - bsd) / (bsmax - (bsmin + bsmax) / 2))
            }
        }
        //byrSedang(bayar);

        let byrTinggi = function(btg) {
            //btg = bayar tinggi
            if (btg <= bbmin) {
                return (btg = 0)
            } else if (btg >= bbmin && btg <= bbmax) {
                return (btg = (btg - bbmin) / (bbmax - bbmin))
            } else if (btg >= bbmax) {
                return (btg = 1)
            }
        }
        //byrTinggi(bayar);

        //aplikasi rule fuzzi
        let rule1 = Math.min(frekRendah(frekuensi), byrRendah(bayar))
        let rule2 = Math.min(frekRendah(frekuensi), byrSedang(bayar))
        let rule3 = Math.min(frekRendah(frekuensi), byrTinggi(bayar))
        let rule4 = Math.min(frekSedang(frekuensi), byrRendah(bayar))
        let rule5 = Math.min(frekSedang(frekuensi), byrSedang(bayar))
        let rule6 = Math.min(frekSedang(frekuensi), byrTinggi(bayar))
        let rule7 = Math.min(frekTinggi(frekuensi), byrRendah(bayar))
        let rule8 = Math.min(frekTinggi(frekuensi), byrSedang(bayar))
        let rule9 = Math.min(frekTinggi(frekuensi), byrTinggi(bayar))

        //agregasi implikasi
        let ruleRendah = Math.max(rule1, rule4)
        let ruleSedang = Math.max(rule2, rule3, rule5, rule7, rule8)
        let ruleTinggi = Math.max(rule6, rule9)

        // Defuzzifikasi

        // mencari titik potong diskon rendah
        const hitRendah1 = drmax / (drmax - drmin)
        const hitRendah2 = 1 / (drmax - drmin)
        const xRendah = (hitRendah1 - ruleRendah) / hitRendah2

        // mencari titik potong diskon sedang persamaan1 (linear naik)
        const hitSedang1 = 1 / ((dsmax + dsmin) / 2 - dsmin)
        const hitSedang2 = dsmin / ((dsmax + dsmin) / 2 - dsmin)
        const xSedang1 = (hitSedang2 + ruleSedang) / hitSedang1

        // mencari titik potong diskon sedang persamaan2 (linear turun)
        const hitSedang3 = dsmax / (dsmax - (dsmax + dsmin) / 2)
        const hitSedang4 = 1 / (dsmax - (dsmax + dsmin) / 2)
        const xSedang2 = (hitSedang3 - ruleSedang) / hitSedang4

        // mencari titik potong diskon tinggi
        const hitTinggi1 = 1 / (dtmax - dtmin)
        const hitTinggi2 = dtmin / (dtmax - dtmin)
        const xTinggi = (hitTinggi2 + ruleTinggi) / hitTinggi1

        // mencari titik potong garis  diskon rendah - sedang
        const xRendah2 = (hitRendah1 - ruleSedang) / hitRendah2 // perpotongan derajat keanggotaan diskon sedang di linear turun diskon rendah
        const xRendah3 = (hitSedang2 + ruleRendah) / hitSedang1 // perpotongan derajat keanggotaan diskon rendah di linear naik diskon sedang

        // mencari titik potong garis diskon sedang - tinggi
        const xTinggi2 = dsmax - ruleTinggi * (dsmax - (dsmax + dsmin) / 2) //perpotongan derajat keanggotaan diskon tinggi di linear turun diskon sedang
        const xTinggi3 = dtmin + (dtmax - dtmin) * ruleSedang // perpotongan derajat keanggotaan diskon sedang di linear naik diskon tinggi

        // membuat konstanta persamaan untuk integral
        const persRendah1 = hitRendah1 / 2
        const persRendah2 = hitRendah2 / 3

        const persSedang1 = hitSedang1 / 3
        const persSedang2 = hitSedang2 / 2
        const persSedang3 = hitSedang3 / 2
        const persSedang4 = hitSedang4 / 3

        const persTinggi1 = hitTinggi1 / 3
        const persTinggi2 = hitTinggi2 / 2

        const ruleRendah2 = ruleRendah / 2
        const ruleSedang2 = ruleSedang / 2
        const ruleTinggi2 = ruleTinggi / 2

        // mencari titik potong batas rendah-sedang
        // tprs = titik potong rendah-sedang
        const tprs1 = ((dsmin + dsmax) / 2 - dsmin) * drmax
        const tprs2 = (drmax - drmin) * dsmin
        const tprs3 = drmax - drmin
        const tprs4 = (dsmax + dsmin) / 2 - dsmin
        const tprs = (tprs1 + tprs2) / (tprs3 + tprs4)
        const tprsy = (drmax - tprs) / (drmax - drmin) // derajat keanggotaan nilai potong pada garis y

        //mencari titik potong batas sedang-tinggi
        //tpst = titik potong sedang-tinggi
        const tpst1 = (dtmax - dtmin) * dsmax
        const tpst2 = (dsmax - (dsmin + dsmax) / 2) * dtmin
        const tpst3 = dsmax - (dsmin + dsmax) / 2
        const tpst4 = dtmax - dtmin
        const tpst = (tpst1 + tpst2) / (tpst3 + tpst4)
        const tpsty = (tpst - dtmin) / (dtmax - dtmin) // derajat keanggotaan nilai potong pada garis y

        /* Model Perhitungan rendah-sedang diatas batas titik potong */
        const rs1Momen1 =
            ruleRendah2 * (xRendah * xRendah) - ruleRendah2 * (drmin * drmin)

        const rs1Momen2 =
            persRendah1 * (tprs * tprs) -
            persRendah2 * (tprs * tprs * tprs) -
            (persRendah1 * (xRendah * xRendah) -
                persRendah2 * (xRendah * xRendah * xRendah))

        const rs1Momen3 =
            persSedang1 * (xSedang1 * xSedang1 * xSedang1) -
            persSedang2 * (xSedang1 * xSedang1) -
            (persSedang1 * (tprs * tprs * tprs) - persSedang2 * (tprs * tprs))
        const rs1Momen4 =
            ruleSedang2 * (xSedang2 * xSedang2) -
            ruleSedang2 * (xSedang1 * xSedang1)
        const rs1Momen5 =
            persSedang3 * (dsmax * dsmax) -
            persSedang4 * (dsmax * dsmax * dsmax) -
            (persSedang3 * (xSedang2 * xSedang2) -
                persSedang4 * (xSedang2 * xSedang2 * xSedang2))

        const rs1Luas1 = ruleRendah * (xRendah - drmin)
        const rs1Luas2 = ((ruleRendah + tprsy) * (tprs - xRendah)) / 2
        const rs1Luas3 = ((tprsy + ruleSedang) * (xSedang1 - tprs)) / 2
        const rs1Luas4 = ruleSedang * (xSedang2 - xSedang1)
        const rs1Luas5 = (ruleSedang * (dsmax - xSedang2)) / 2

        const diskon1 =
            (rs1Momen1 + rs1Momen2 + rs1Momen3 + rs1Momen4 + rs1Momen5) /
            (rs1Luas1 + rs1Luas2 + rs1Luas3 + rs1Luas4 + rs1Luas5)

        /* Model Perhitungan rendah diatas titik potong dan sedang dibawah titik potong */
        const rs2Momen1 =
            ruleRendah2 * (xRendah * xRendah) - ruleRendah2 * (drmin * drmin)
        const rs2Momen2 =
            persRendah1 * (xRendah2 * xRendah2) -
            persRendah2 * (xRendah2 * xRendah2 * xRendah2) -
            (persRendah1 * (xRendah * xRendah) -
                persRendah2 * (xRendah * xRendah * xRendah))
        const rs2Momen3 =
            ruleSedang2 * (xSedang2 * xSedang2) -
            ruleSedang2 * (xRendah2 * xRendah2)
        const rs2Momen4 =
            persSedang3 * (dsmax * dsmax) -
            persSedang4 * (dsmax * dsmax * dsmax) -
            (persSedang3 * (xSedang2 * xSedang2) -
                persSedang4 * (xSedang2 * xSedang2 * xSedang2))

        const rs2Luas1 = ruleRendah * (xRendah - drmin)
        const rs2Luas2 = ((ruleRendah + ruleSedang) * (xRendah2 - xRendah)) / 2
        const rs2Luas3 = ruleSedang * (xSedang2 - xRendah2)
        const rs2Luas4 = (ruleSedang * (dsmax - xSedang2)) / 2

        const diskon2 =
            (rs2Momen1 + rs2Momen2 + rs2Momen3 + rs2Momen4) /
            (rs2Luas1 + rs2Luas2 + rs2Luas3 + rs2Luas4)

        /* Model Perhitungan sedang diatas titik potong dan rendah dibawah titik potong */
        const rs3Momen1 =
            ruleRendah2 * (xRendah3 * xRendah3) - ruleRendah2 * (drmin * drmin)

        const rs3Momen2 =
            persSedang1 * (xSedang1 * xSedang1 * xSedang1) -
            persSedang2 * (xSedang1 * xSedang1) -
            (persSedang1 * (xRendah3 * xRendah3 * xRendah3) -
                persSedang2 * (xRendah3 * xRendah3))
        const rs3Momen3 =
            ruleSedang2 * (xSedang2 * xSedang2) -
            ruleSedang2 * (xSedang1 * xSedang1)
        const rs3Momen4 =
            persSedang3 * (dsmax * dsmax) -
            persSedang4 * (dsmax * dsmax * dsmax) -
            (persSedang3 * (xSedang2 * xSedang2) -
                persSedang4 * (xSedang2 * xSedang2 * xSedang2))

        const rs3Luas1 = ruleRendah * (xRendah3 - drmin)
        const rs3Luas2 = ((ruleRendah + ruleSedang) * (xSedang1 - xRendah3)) / 2
        const rs3Luas3 = (xSedang2 - xSedang1) * ruleSedang
        const rs3Luas4 = ((dsmax - xSedang2) * ruleSedang) / 2

        const diskon3 =
            (rs3Momen1 + rs3Momen2 + rs3Momen3 + rs3Momen4) /
            (rs3Luas1 + rs3Luas2 + rs3Luas3 + rs3Luas4)

        /* Model Perhitungan sedang-tinggi diatas batas titik potong */
        const st1Momen1 =
            persSedang1 * (xSedang1 * xSedang1 * xSedang1) -
            persSedang2 * (xSedang1 * xSedang1) -
            (persSedang1 * (dsmin * dsmin * dsmin) -
                persSedang2 * (dsmin * dsmin))

        const st1Momen2 =
            ruleSedang2 * (xSedang2 * xSedang2) -
            ruleSedang2 * (xSedang1 * xSedang1)
        const st1Momen3 =
            persSedang3 * (tpst * tpst) -
            persSedang4 * (tpst * tpst * tpst) -
            (persSedang3 * (xSedang2 * xSedang2) -
                persSedang4 * (xSedang2 * xSedang2 * xSedang2))
        const st1Momen4 =
            persTinggi1 * (xTinggi * xTinggi * xTinggi) -
            persTinggi2 * (xTinggi * xTinggi) -
            (persTinggi1 * (tpst * tpst * tpst) - persTinggi2 * (tpst * tpst))
        const st1Momen5 =
            ruleTinggi2 * (dtmax * dtmax) - ruleTinggi2 * (xTinggi * xTinggi)

        const st1Luas1 = ((xSedang1 - dsmin) / 2) * ruleSedang
        const st1Luas2 = ruleSedang * (xSedang2 - xSedang1)
        const st1Luas3 = ((ruleSedang + ruleTinggi) * (tpst - xSedang2)) / 2
        const st1Luas4 = ((ruleSedang + ruleTinggi) * (xTinggi - tpst)) / 2
        const st1Luas5 = ruleTinggi * (dtmax - xTinggi)

        const diskon4 =
            (st1Momen1 + st1Momen2 + st1Momen3 + st1Momen4 + st1Momen5) /
            (st1Luas1 + st1Luas2 + st1Luas3 + st1Luas4 + st1Luas5)

        /* Model Perhitungan sedang diatas titik potong dan tinggi dibawah titik potong */
        const st2Momen1 =
            persSedang1 * (xSedang1 * xSedang1 * xSedang1) -
            persSedang2 * (xSedang1 * xSedang1) -
            (persSedang1 * (dsmin * dsmin * dsmin) -
                persSedang2 * (dsmin * dsmin))
        const st2Momen2 =
            ruleSedang2 * (xSedang2 * xSedang2) -
            ruleSedang2 * (xSedang1 * xSedang1)
        const st2Momen3 =
            persSedang3 * (xTinggi2 * xTinggi2) -
            persSedang4 * (xTinggi2 * xTinggi2 * xTinggi2) -
            (persSedang3 * (xSedang2 * xSedang2) -
                persSedang4 * (xSedang2 * xSedang2 * xSedang2))
        const st2Momen4 =
            ruleTinggi2 * (dsmax * dsmax) - ruleTinggi2 * (xTinggi2 * xTinggi2)

        const st2Luas1 = ((xSedang1 - dsmin) * ruleSedang) / 2
        const st2Luas2 = ruleSedang * (xSedang2 - xSedang1)
        const st2Luas3 = ((xTinggi2 - xSedang2) * (ruleSedang + ruleTinggi)) / 2
        const st2Luas4 = (dsmax - xTinggi2) * ruleTinggi

        const diskon5 =
            (st2Momen1 + st2Momen2 + st2Momen3 + st2Momen4) /
            (st2Luas1 + st2Luas2 + st2Luas3 + st2Luas4)

        /* Model Perhitungan tinggi diatas titik potong dan sedang dibawah titik potong */
        const st3Momen1 =
            persSedang1 * (xSedang1 * xSedang1 * xSedang1) -
            persSedang2 * (xSedang1 * xSedang1) -
            (persSedang1 * (dsmin * dsmin * dsmin) -
                persSedang2 * (dsmin * dsmin))
        const st3Momen2 =
            ruleSedang2 * (xTinggi3 * xTinggi3) -
            ruleSedang2 * (xSedang1 * xSedang1)
        const st3Momen3 =
            persTinggi1 * (xTinggi * xTinggi * xTinggi) -
            persTinggi2 * (xTinggi * xTinggi) -
            (persTinggi1 * (xTinggi3 * xTinggi3 * xTinggi3) -
                persTinggi2 * (xTinggi3 * xTinggi3))
        const st3Momen4 =
            ruleTinggi2 * (dtmax * dtmax) - ruleTinggi2 * (xTinggi * xTinggi)

        const st3Luas1 = ((xSedang1 - dsmin) * ruleSedang) / 2
        const st3Luas2 = (xTinggi3 - xSedang1) * ruleSedang
        const st3Luas3 = ((ruleSedang + ruleTinggi) * (xTinggi - xTinggi3)) / 2
        const st3Luas4 = (dtmax - xTinggi) * ruleTinggi

        const diskon6 =
            (st3Momen1 + st3Momen2 + st3Momen3 + st3Momen4) /
            (st3Luas1 + st3Luas2 + st3Luas3 + st3Luas4)

        // defuzzufikasi (derajat rendah, derajat sedang, derajat tinggi)
        let diskonTotal = function(rd, sd, tg) {
            if (rd >= tprsy && rd < 1 && sd >= tprsy && sd < 1 && tg == 0) {
                return diskon1
            } else if (rd == 1 && sd == 0 && tg == 0) {
                // return 0;
                return dr
            } else if (rd == 0 && sd == 1 && tg == 0) {
                // return 15;
                return ds
            } else if (rd == 0 && sd == 0 && tg == 1) {
                // return 30;
                return dt
            } else if (
                rd >= tprsy &&
                rd < 1 &&
                sd <= tprsy &&
                sd < 1 &&
                tg == 0
            ) {
                return diskon2
            } else if (
                rd <= tprsy &&
                rd < 1 &&
                sd >= tprsy &&
                sd < 1 &&
                tg == 0
            ) {
                return diskon3
            }
            // new condition
            else if (rd <= tprsy || (sd >= tprsy && tg == 0)) {
                return diskon3
            } else if (
                rd == 0 &&
                sd >= tpsty &&
                sd < 1 &&
                tg >= tpsty &&
                tg < 1
            ) {
                return diskon4
            } else if (
                rd == 0 &&
                sd >= tpsty &&
                sd < 1 &&
                tg <= tpsty &&
                sd < 1
            ) {
                return diskon5
            } else if (
                rd == 0 &&
                sd <= tpsty &&
                sd < 1 &&
                tg >= tpsty &&
                sd < 1
            ) {
                return diskon6
            }
        }

        res.json({
            diskon: Math.round(diskonTotal(ruleRendah, ruleSedang, ruleTinggi)),
        })
    },
}
