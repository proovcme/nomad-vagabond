#pragma once
// Auto-generated class & AddCmd registry for Project Nomads native core
// Registers all Nebula Device 1 + nnature + nnetwork + nnomads classes.
#include "nkernel.hpp"

inline void registerAllGeneratedClasses(nebula::nKernelServer& ks) {
    // Standard Nebula Device 1 classes
    ks.registerStubClass("n3dnode", "nroot");
    ks.registerStubClass("nanimcurvearray", "nroot");
    ks.registerStubClass("nanimnode", "nroot");
    ks.registerStubClass("nanimserver", "nroot");
    ks.registerStubClass("naudioserver2", "nroot");
    ks.registerStubClass("nbinscriptserver", "nroot");
    ks.registerStubClass("nblob", "nroot");
    ks.registerStubClass("nchannelserver", "nroot");
    ks.registerStubClass("ncharacternode", "nroot");
    ks.registerStubClass("ncharacterserver", "nroot");
    ks.registerStubClass("nchnmodulator", "nroot");
    ks.registerStubClass("nchnreader", "nroot");
    ks.registerStubClass("nchnsplitter", "nroot");
    ks.registerStubClass("ncollidenode", "nroot");
    ks.registerStubClass("ncollideserver", "nroot");
    ks.registerStubClass("nconserver", "nroot");
    ks.registerStubClass("ncurvearraynode", "nroot");
    ks.registerStubClass("nd3d8indexbuffer", "nroot");
    ks.registerStubClass("nd3d8pixelshader", "nroot");
    ks.registerStubClass("nd3d8server", "nroot");
    ks.registerStubClass("nd3d8texture", "nroot");
    ks.registerStubClass("ndi8server", "nroot");
    ks.registerStubClass("ndinput8server", "nroot");
    ks.registerStubClass("ndsoundserver2", "nroot");
    ks.registerStubClass("nfileserver", "nroot");
    ks.registerStubClass("nfileserver2", "nroot");
    ks.registerStubClass("nflipflop", "nroot");
    ks.registerStubClass("nfognode", "nroot");
    ks.registerStubClass("ngfxserver", "nroot");
    ks.registerStubClass("nglserver", "nroot");
    ks.registerStubClass("nhypermixer2", "nroot");
    ks.registerStubClass("nindexbuffer", "nroot");
    ks.registerStubClass("ninputserver", "nroot");
    ks.registerStubClass("nipol", "nroot");
    ks.registerStubClass("njoint2", "nroot");
    ks.registerStubClass("nlenseflare", "nroot");
    ks.registerStubClass("nlightnode", "nroot");
    ks.registerStubClass("nlinknode", "nroot");
    ks.registerStubClass("nlistenernode", "nroot");
    ks.registerStubClass("nmathserver", "nroot");
    ks.registerStubClass("nmeshcluster2", "nroot");
    ks.registerStubClass("nmesheffect", "nroot");
    ks.registerStubClass("nmeshemitter", "nroot");
    ks.registerStubClass("nmeshipol", "nroot");
    ks.registerStubClass("nmeshmixer", "nroot");
    ks.registerStubClass("nmeshnode", "nroot");
    ks.registerStubClass("nmixer", "nroot");
    ks.registerStubClass("nnpkfileserver", "nroot");
    ks.registerStubClass("nobserver", "nroot");
    ks.registerStubClass("noctree", "nroot");
    ks.registerStubClass("nopcodeserver", "nroot");
    ks.registerStubClass("noverlayplane", "nroot");
    ks.registerStubClass("nparticleserver", "nroot");
    ks.registerStubClass("npemitter", "nroot");
    ks.registerStubClass("npixelshader", "nroot");
    ks.registerStubClass("npointemitter", "nroot");
    ks.registerStubClass("nprender", "nroot");
    ks.registerStubClass("nprofileserver", "nroot");
    ks.registerStubClass("npservemitter", "nroot");
    ks.registerStubClass("nsbufshadowserver", "nroot");
    ks.registerStubClass("nscenegraph2", "nroot");
    ks.registerStubClass("nscriptlet", "nroot");
    ks.registerStubClass("nshadernode", "nroot");
    ks.registerStubClass("nshadowcaster", "nroot");
    ks.registerStubClass("nshadowcontrol", "nroot");
    ks.registerStubClass("nshadowserver", "nroot");
    ks.registerStubClass("nsoundnode", "nroot");
    ks.registerStubClass("nspecialfxserver", "nroot");
    ks.registerStubClass("nspriterender", "nroot");
    ks.registerStubClass("nstaticmeshemitter", "nroot");
    ks.registerStubClass("nstream", "nroot");
    ks.registerStubClass("ntclscriptlet", "nroot");
    ks.registerStubClass("ntclserver", "nroot");
    ks.registerStubClass("ntexarraynode", "nroot");
    ks.registerStubClass("ntexture", "nroot");
    ks.registerStubClass("nthreshnode", "nroot");
    ks.registerStubClass("ntrailrender", "nroot");
    ks.registerStubClass("nvertexbuffer", "nroot");
    ks.registerStubClass("nvisnode", "nroot");
    ks.registerStubClass("nwavstream", "nroot");
    ks.registerStubClass("nweighttree", "nroot");

    // Proprietary classes (nnature, nnetwork, nnomads) with exact inheritance & AddCmds
    { auto* cl = ks.registerStubClass("nleafrender", "nanimnode");
      cl->addCmdProto("v_setsize_f", "SSIZ");
      cl->addCmdProto("f_getsize_v", "GSIZ");
      cl->addCmdProto("v_setwindstrength_f", "SWST");
      cl->addCmdProto("f_getwindstrength_v", "GWST");
      cl->addCmdProto("v_setwinddir_f", "SWDR");
      cl->addCmdProto("f_getwinddir_v", "GWDR");
    }
    { auto* cl = ks.registerStubClass("ngrassrender", "nanimnode");
      cl->addCmdProto("v_setmeshnode_s", "SMSH");
      cl->addCmdProto("s_getmeshnode_v", "GMSH");
      cl->addCmdProto("v_setwindstrength_f", "SWST");
      cl->addCmdProto("f_getwindstrength_v", "GWST");
      cl->addCmdProto("v_setwinddir_f", "SWDR");
      cl->addCmdProto("f_getwinddir_v", "GWDR");
      cl->addCmdProto("v_setsize_f", "SSZE");
      cl->addCmdProto("f_getsize_v", "GSZE");
    }
    { auto* cl = ks.registerStubClass("nmeshsway", "nanimnode");
      cl->addCmdProto("v_setreadonly_b", "SRDO");
      cl->addCmdProto("b_getreadonly_v", "GRDO");
      cl->addCmdProto("v_setmeshnode_s", "SMND");
      cl->addCmdProto("s_getmeshnode_v", "GMND");
      cl->addCmdProto("v_setwinddir_f", "SWDD");
      cl->addCmdProto("f_getwinddir_v", "GWDD");
      cl->addCmdProto("v_setwindstrength_f", "SWDS");
      cl->addCmdProto("f_getwindstrength_v", "GWDS");
      cl->addCmdProto("v_setflex_f", "SFLX");
      cl->addCmdProto("f_getflex_v", "GFLX");
    }
    { auto* cl = ks.registerStubClass("ncloudrender", "nanimnode");
      cl->addCmdProto("v_setmeshnode_s", "SMSN");
      cl->addCmdProto("s_getmeshnode_v", "GMSN");
      cl->addCmdProto("v_setdiffuse_ffff", "SDIF");
      cl->addCmdProto("ffff_getdiffuse_v", "GDIF");
      cl->addCmdProto("v_setambient_ffff", "SAMB");
      cl->addCmdProto("ffff_getambient_v", "GAMB");
      cl->addCmdProto("v_setemissive_ffff", "SEMM");
      cl->addCmdProto("ffff_getemissive_v", "GEMM");
      cl->addCmdProto("v_setabsorb_ffff", "SABS");
      cl->addCmdProto("ffff_getabsorb_v", "GABS");
      cl->addCmdProto("v_setradius_f", "SRAD");
      cl->addCmdProto("f_getradius_v", "GRAD");
      cl->addCmdProto("v_setalpha_f", "SALP");
      cl->addCmdProto("f_getalpha_v", "GALP");
    }
    { auto* cl = ks.registerStubClass("ngroundplane", "nvisnode");
    }
    { auto* cl = ks.registerStubClass("nclouds", "nvisnode");
      cl->addCmdProto("v_beginclouds_if", "BCDS");
      cl->addCmdProto("v_endclouds_v", "ECDS");
      cl->addCmdProto("v_setlayernearfadedist_f", "SLNF");
      cl->addCmdProto("i_getlayerdensity_v", "GLDN");
      cl->addCmdProto("f_getlayerspacing_v", "GLSP");
      cl->addCmdProto("f_getlayerextent_v", "GLXT");
      cl->addCmdProto("f_getlayernearfadedist_v", "GLNF");
    }
    { auto* cl = ks.registerStubClass("nclouddesc", "nvisnode");
      cl->addCmdProto("v_setaltitude_f", "SLAL");
      cl->addCmdProto("v_setfoggingcolor_ffff", "SFCL");
      cl->addCmdProto("v_setfoggingmod_f", "SFMO");
      cl->addCmdProto("v_setsize_fff", "SCSI");
      cl->addCmdProto("v_setsizex_f", "SCSX");
      cl->addCmdProto("v_setsizey_f", "SCSY");
      cl->addCmdProto("v_setsizez_f", "SCSZ");
      cl->addCmdProto("v_setquadoffset_fff", "SCQU");
      cl->addCmdProto("v_setoffsetmod_fff", "SCOM");
      cl->addCmdProto("v_setoffsetmodx_f", "SCOX");
      cl->addCmdProto("v_setoffsetmody_f", "SCOY");
      cl->addCmdProto("v_setoffsetmodz_f", "SCOZ");
      cl->addCmdProto("v_setoffsetspeed_f", "SCOS");
      cl->addCmdProto("v_setopacitymod_f", "SCOP");
      cl->addCmdProto("v_setwind_ff", "SWND");
      cl->addCmdProto("f_getaltitude_v", "GLAL");
      cl->addCmdProto("ffff_getfoggingcolor_v", "GFCL");
      cl->addCmdProto("f_getfoggingmod_v", "GFMO");
      cl->addCmdProto("fff_getsize_v", "GCSI");
      cl->addCmdProto("fff_getquadoffset_v", "GCQU");
      cl->addCmdProto("fff_getoffsetmod_v", "GCOM");
      cl->addCmdProto("f_getoffsetspeed_v", "GCOS");
      cl->addCmdProto("f_getopacitymod_v", "GCOP");
      cl->addCmdProto("ff_getwind_v", "GWND");
    }
    { auto* cl = ks.registerStubClass("nnetnode", "nroot");
      cl->addCmdProto("v_markshadow_b", "M_SH");
      cl->addCmdProto("b_isshadow_v", "I_SH");
    }
    { auto* cl = ks.registerStubClass("nnetwork2", "nroot");
    }
    { auto* cl = ks.registerStubClass("nsocket2", "nnetwork2");
    }
    { auto* cl = ks.registerStubClass("ncommserver", "nroot");
      cl->addCmdProto("v_opensession_si", "CSOS");
      cl->addCmdProto("i_asksessions_bsi", "CSAS");
      cl->addCmdProto("v_joinsession_i", "CSJS");
      cl->addCmdProto("v_closesession_v", "CSCS");
      cl->addCmdProto("v_setregulartransmission_b", "RGTR");
      cl->addCmdProto("v_setdrthreshold_f", "SDRT");
      cl->addCmdProto("f_getdrthreshold_v", "GDRT");
      cl->addCmdProto("v_showstats_v", "SHST");
      cl->addCmdProto("v_hidestats_v", "HDST");
      cl->addCmdProto("v_togglestats_v", "TGST");
      cl->addCmdProto("v_resetstats_v", "RSST");
      cl->addCmdProto("v_printentities_v", "PREN");
      cl->addCmdProto("v_printghosts_v", "PRGH");
      cl->addCmdProto("v_settransmissiontime_f", "STTT");
      cl->addCmdProto("f_gettransmissiontime_v", "GTTT");
      cl->addCmdProto("v_setprediction_s", "STPR");
      cl->addCmdProto("s_getprediction_v", "GTPR");
      cl->addCmdProto("v_setsmoothing_s", "STSM");
      cl->addCmdProto("s_getsmoothing_v", "GTSM");
      cl->addCmdProto("i_getclientid_v", "GCID");
      cl->addCmdProto("b_ishost_v", "ISHO");
    }
    { auto* cl = ks.registerStubClass("nphysicshandler", "nroot");
      cl->addCmdProto("v_resetblist_v", "RBLT");
      cl->addCmdProto("v_addblayer_ffffffffffff", "ADBL");
      cl->addCmdProto("v_setvisualizeblayer_b", "SVBL");
      cl->addCmdProto("b_getvisualizeblayer_v", "GVBL");
    }
    { auto* cl = ks.registerStubClass("ncollhandler2", "nroot");
      cl->addCmdProto("v_setvisualize_b", "SVZL");
      cl->addCmdProto("b_getvisualize_v", "GVZL");
    }
    { auto* cl = ks.registerStubClass("nweatherhandler", "nroot");
    }
    { auto* cl = ks.registerStubClass("nstatenode", "nnetnode");
      cl->addCmdProto("v_setstate_s", "STST");
      cl->addCmdProto("s_getstate_v", "GTST");
      cl->addCmdProto("v_announcestate_s", "ANST");
      cl->addCmdProto("v_announcestatewithtimeoffset_sf", "ASTW");
      cl->addCmdProto("s_getannouncedstate_v", "GANS");
      cl->addCmdProto("v_setremoveable_b", "SRMV");
      cl->addCmdProto("b_isremoveable_v", "GRMB");
      cl->addCmdProto("i_getclanid_v", "GRID");
      cl->addCmdProto("o_getprototype_v", "GPTO");
      cl->addCmdProto("o_getclan_v", "GCLN");
      cl->addCmdProto("b_isstatetimeover_v", "ISTO");
      cl->addCmdProto("b_isfirstframe_v", "ISFF");
      cl->addCmdProto("v_setpaused_b", "SPSD");
      cl->addCmdProto("b_ispaused_v", "IPSD");
      cl->addCmdProto("b_iscinematicfinished_v", "ICFN");
      cl->addCmdProto("v_setcinematicfinished_b", "SCFN");
      cl->addCmdProto("v_setshowstateswitch_b", "SSSS");
      cl->addCmdProto("b_getshowstateswitch_v", "GSSS");
      cl->addCmdProto("v_setrecordstarttime_f", "SRST");
      cl->addCmdProto("f_getrecordstarttime_v", "GRST");
      cl->addCmdProto("v_setsymbolicname_s", "SSMN");
      cl->addCmdProto("s_getsymbolicname_v", "GSMN");
      cl->addCmdProto("v_setthrowevents_b", "STHR");
      cl->addCmdProto("b_getthrowevents_v", "GTHR");
      cl->addCmdProto("v_seteventslot_ss", "SEVS");
      cl->addCmdProto("s_geteventslot_s", "GEVS");
      cl->addCmdProto("b_throwevent_s", "THRW");
      cl->addCmdProto("i_getmachineid_v", "GMID");
      cl->addCmdProto("v_setcreationtime_f", "SCTM");
      cl->addCmdProto("f_getcreationtime_v", "GCTM");
      cl->addCmdProto("v_setlifetime_f", "SLFT");
      cl->addCmdProto("f_getlifetime_v", "GLFT");
      cl->addCmdProto("b_islifetimeover_v", "ILTO");
    }
    { auto* cl = ks.registerStubClass("nclan", "nstatenode");
      cl->addCmdProto("o_createvehicle_s", "CVCL");
      cl->addCmdProto("o_createandselvehicle_s", "CSVC");
      cl->addCmdProto("o_createvehiclewithname_ss", "CVWN");
      cl->addCmdProto("o_createandselvehiclewithname_ss", "CSVN");
      cl->addCmdProto("v_releasevehicle_o", "RVCL");
      cl->addCmdProto("o_moveobjecttoclan_oi", "MOTC");
      cl->addCmdProto("i_getnetname_v", "GNNM");
      cl->addCmdProto("v_setrealname_s", "SRLN");
      cl->addCmdProto("s_getrealname_v", "GRLN");
      cl->addCmdProto("v_setclancolor_fff", "SCCO");
      cl->addCmdProto("fff_getclancolor_v", "GCCO");
      cl->addCmdProto("o_getmaennel_v", "GMAN");
      cl->addCmdProto("v_setbasemaximum_f", "SBMX");
      cl->addCmdProto("f_getbasemaximum_v", "GBMX");
      cl->addCmdProto("f_getcurrentmaximum_v", "GCMX");
      cl->addCmdProto("v_setcurrentenergy_f", "SCEN");
      cl->addCmdProto("f_getcurrentenergy_v", "GCEN");
      cl->addCmdProto("b_hasenergy_v", "HASE");
      cl->addCmdProto("v_setasuser_b", "SAUS");
      cl->addCmdProto("b_isuser_v", "GISU");
      cl->addCmdProto("v_setenvironment_b", "SENV");
      cl->addCmdProto("b_isenvironment_v", "IENV");
      cl->addCmdProto("v_importclan_o", "IMPC");
      cl->addCmdProto("v_setposition_fff", "SCLP");
      cl->addCmdProto("fff_getposition_v", "GCLP");
      cl->addCmdProto("v_setorientation_fff", "SCLO");
      cl->addCmdProto("fff_getorientation_v", "GCLO");
      cl->addCmdProto("o_getplayerisland_v", "GPLI");
      cl->addCmdProto("v_setnoticeenergy_b", "SNTE");
      cl->addCmdProto("b_getnoticeenergy_v", "GNTE");
      cl->addCmdProto("v_setfaction_i", "SFCT");
      cl->addCmdProto("i_getfaction_v", "GFCT");
      cl->addCmdProto("v_setzoneradius_f", "SZRD");
      cl->addCmdProto("f_getzoneradius_v", "GZRD");
      cl->addCmdProto("v_setzoneheight_f", "SZHT");
      cl->addCmdProto("f_getzoneheight_v", "GZHT");
      cl->addCmdProto("v_setdangerzone_f", "SDZN");
      cl->addCmdProto("f_getdangerzone_v", "GDZN");
    }
    { auto* cl = ks.registerStubClass("ncontainer", "nstatenode");
      cl->addCmdProto("v_setvehicleclass_s", "SVCL");
      cl->addCmdProto("s_getvehicleclass_v", "GVCL");
      cl->addCmdProto("b_isvehicleclass_s", "IVCL");
      cl->addCmdProto("v_setposition_fff", "SPOS");
      cl->addCmdProto("fff_getposition_v", "GPOS");
      cl->addCmdProto("v_setdirection_fff", "SDIR");
      cl->addCmdProto("fff_getdirection_v", "GDIR");
      cl->addCmdProto("b_ishandcontrol_v", "ISHC");
      cl->addCmdProto("v_sethandcontrol_b", "STHC");
      cl->addCmdProto("v_setspeed_fff", "SSPD");
      cl->addCmdProto("fff_getspeed_v", "GSPD");
      cl->addCmdProto("v_setrelspeed_fff", "SRSP");
      cl->addCmdProto("v_addrelspeed_fff", "ARSP");
      cl->addCmdProto("v_setmass_f", "SMAS");
      cl->addCmdProto("f_getmass_v", "GMAS");
      cl->addCmdProto("v_setrotinertia_f", "SRTI");
      cl->addCmdProto("f_getrotinertia_v", "GRTI");
      cl->addCmdProto("v_setairconst_f", "SACO");
      cl->addCmdProto("f_getairconst_v", "GACO");
      cl->addCmdProto("v_setrotairconst_f", "SRAC");
      cl->addCmdProto("f_getrotairconst_v", "GRAC");
      cl->addCmdProto("v_setstability_f", "SSTB");
      cl->addCmdProto("f_getstability_v", "GSTB");
      cl->addCmdProto("v_setradius_f", "SRAD");
      cl->addCmdProto("f_getradius_v", "GRAD");
      cl->addCmdProto("v_setenergy_f", "SEGY");
      cl->addCmdProto("f_getenergy_v", "GEGY");
      cl->addCmdProto("v_setrelenergy_f", "SREN");
      cl->addCmdProto("f_getrelenergy_v", "GREN");
      cl->addCmdProto("v_setmaxenergy_f", "SXEY");
      cl->addCmdProto("f_getmaxenergy_v", "GXEY");
      cl->addCmdProto("b_reduceenergy_f", "RDCE");
      cl->addCmdProto("v_addenergy_f", "ADDE");
      cl->addCmdProto("v_setarmor_sf", "SARM");
      cl->addCmdProto("f_getarmor_s", "GARM");
      cl->addCmdProto("s_getreasonofdeath_v", "GROD");
      cl->addCmdProto("v_setvisualizephysics_b", "SVSP");
      cl->addCmdProto("b_getvisualizephysics_v", "GVSP");
      cl->addCmdProto("v_setvisualizeway_b", "SVSW");
      cl->addCmdProto("b_getvisualizeway_v", "GVSW");
      cl->addCmdProto("v_setvisualizecmdbuffer_b", "SVSB");
      cl->addCmdProto("b_getvisualizecmdbuffer_v", "GVSB");
      cl->addCmdProto("v_setvisualizecinematic_b", "SVCN");
      cl->addCmdProto("b_getvisualizecinematic_v", "GVCN");
      cl->addCmdProto("v_setvisible_b", "SVBL");
      cl->addCmdProto("v_addcommand_bfffbfffsf", "ACMD");
      cl->addCmdProto("v_addcommandlocal_bfffbfffsf", "ACML");
      cl->addCmdProto("v_clearcommandlist_v", "CCML");
      cl->addCmdProto("ssssssss_shownextcommands_v", "SN8C");
      cl->addCmdProto("v_setartefactowner_s", "SAFO");
      cl->addCmdProto("o_getartefactowner_v", "GAFO");
      cl->addCmdProto("v_setartefactmode_b", "SAFM");
      cl->addCmdProto("b_getartefactmode_v", "GAFM");
      cl->addCmdProto("v_setartefactuse_b", "SAFU");
      cl->addCmdProto("b_getartefactuse_v", "GAFU");
      cl->addCmdProto("v_setartefactusagedelay_f", "SAUD");
      cl->addCmdProto("f_getartefactusagedelay_v", "GAUD");
      cl->addCmdProto("v_setuseabletest_s", "SUTE");
      cl->addCmdProto("s_getuseabletest_v", "GUTE");
      cl->addCmdProto("v_setuseabletester_s", "SUTR");
      cl->addCmdProto("s_getuseabletester_v", "GUTR");
      cl->addCmdProto("v_setquickslotartefact_b", "SQSA");
      cl->addCmdProto("b_getquickslotartefact_v", "GQSA");
      cl->addCmdProto("v_setcharges_i", "SCRG");
      cl->addCmdProto("i_getcharges_v", "GCRG");
      cl->addCmdProto("v_setmaxcharges_i", "SMCG");
      cl->addCmdProto("i_getmaxcharges_v", "GMCG");
      cl->addCmdProto("v_setartefactuseenergy_f", "SAUE");
      cl->addCmdProto("f_getartefactuseenergy_v", "GAUE");
      cl->addCmdProto("v_setcreator_s", "SCRT");
      cl->addCmdProto("o_getcreator_v", "GCRT");
      cl->addCmdProto("v_addchildvehicle_s", "ACHV");
      cl->addCmdProto("v_removechildvehicle_o", "RCHV");
      cl->addCmdProto("v_setparentvehicle_s", "SPAV");
      cl->addCmdProto("o_getparentvehicle_v", "GPAV");
      cl->addCmdProto("o_getfirstvehicle_v", "GFTV");
      cl->addCmdProto("o_getnextvehicle_o", "GNXV");
      cl->addCmdProto("v_alignvehicle_offffff", "ALIV");
      cl->addCmdProto("v_setdrall_fff", "SDRL");
      cl->addCmdProto("v_setfocusallowed_b", "SFCA");
      cl->addCmdProto("b_getfocusallowed_v", "GFCA");
      cl->addCmdProto("v_countup_sf", "CTUP");
      cl->addCmdProto("v_countdown_sf", "CTDN");
      cl->addCmdProto("v_countupanddown_sfff", "CTUD");
      cl->addCmdProto("v_setinsidequickslot_b", "SIQS");
      cl->addCmdProto("b_isinparentsystem_v", "IIPS");
      cl->addCmdProto("b_iscollected_v", "ICLC");
      cl->addCmdProto("b_iskilled_v", "IKLD");
      cl->addCmdProto("b_isengineworking_v", "IENW");
      cl->addCmdProto("b_isatabyss_v", "IAAB");
      cl->addCmdProto("b_isanimfinished_v", "IAFD");
      cl->addCmdProto("b_isvisible_v", "ISVB");
      cl->addCmdProto("b_isturbomove_v", "ITBM");
      cl->addCmdProto("b_isenergyzero_v", "IEZR");
      cl->addCmdProto("b_iscommandlistempty_v", "ICLE");
      cl->addCmdProto("b_iscollided_v", "ICLD");
      cl->addCmdProto("b_ismoveable_v", "IMVB");
      cl->addCmdProto("b_isrotateable_v", "IRTB");
      cl->addCmdProto("b_isinsidequickslot_v", "IIQS");
      cl->addCmdProto("b_iscrashed_v", "ICRS");
      cl->addCmdProto("v_setforcedfallflag_b", "SFFG");
      cl->addCmdProto("b_getforcedfallflag_v", "GFFG");
      cl->addCmdProto("v_setcinematicsequence_s", "SCSQ");
      cl->addCmdProto("o_getcinematicsequence_v", "GCSQ");
      cl->addCmdProto("s_getcinematicsequencename_v", "GCSN");
      cl->addCmdProto("b_istimetoturnback_v", "ITTB");
      cl->addCmdProto("b_isreplenished_v", "IRPL");
      cl->addCmdProto("o_getcollvehicle_v", "GCLV");
      cl->addCmdProto("v_setinshop_b", "SINS");
      cl->addCmdProto("b_isinshop_v", "IINS");
      cl->addCmdProto("v_setartefactprice_i", "SAPR");
      cl->addCmdProto("i_getartefactprice_v", "GAPR");
      cl->addCmdProto("s_getavoidcollisionkind_v", "GAVC");
      cl->addCmdProto("s_getavoidcollisiondirection_v", "GAVD");
      cl->addCmdProto("v_enableemitting_b", "ENEM");
      cl->addCmdProto("b_isemittingenabled_v", "IEEN");
      cl->addCmdProto("v_setemitterpopulation_i", "SPOP");
      cl->addCmdProto("o_getgarage_v", "GGGE");
      cl->addCmdProto("v_setuseenergypaid_b", "SUEP");
      cl->addCmdProto("v_triggermanually_v", "TRIG");
    }
    { auto* cl = ks.registerStubClass("ntriggerobject", "ncontainer");
      cl->addCmdProto("v_settriggerradius_f", "STRD");
      cl->addCmdProto("f_gettriggerradius_v", "GTRD");
    }
    { auto* cl = ks.registerStubClass("nweatherdesc", "ncontainer");
      cl->addCmdProto("v_setclouddescpath_s", "SCDP");
      cl->addCmdProto("v_setareaofeffect_f", "SAOE");
      cl->addCmdProto("v_setdefaultflag_b", "SDFT");
      cl->addCmdProto("s_getclouddescpath_v", "GCDP");
      cl->addCmdProto("f_getareaofeffect_v", "GAOE");
      cl->addCmdProto("b_isdefault_v", "IDFT");
    }
    { auto* cl = ks.registerStubClass("nore", "ncontainer");
      cl->addCmdProto("v_setorequantity_f", "SOQU");
      cl->addCmdProto("v_reduceorequantity_f", "ROQU");
      cl->addCmdProto("f_getorequantity_v", "GOQU");
      cl->addCmdProto("b_isoreusedup_v", "IOUU");
    }
    { auto* cl = ks.registerStubClass("nstation", "ncontainer");
      cl->addCmdProto("b_islocked_v", "ISLO");
      cl->addCmdProto("v_lockstation_v", "LCKS");
      cl->addCmdProto("v_unlockstation_v", "UNLK");
    }
    { auto* cl = ks.registerStubClass("nautonom", "ncontainer");
      cl->addCmdProto("o_searchtarget_v", "STGT");
      cl->addCmdProto("v_setvehicletarget_sfb", "AVTG");
      cl->addCmdProto("v_setvehicletarget2_sfbfff", "AVT2");
      cl->addCmdProto("v_setpositiontarget_ffff", "APTG");
      cl->addCmdProto("v_setgaragetarget_v", "AGTG");
      cl->addCmdProto("v_setremovepostarget_v", "ARPT");
      cl->addCmdProto("v_deletetarget_v", "DLTG");
      cl->addCmdProto("s_gettarget_v", "GCTG");
      cl->addCmdProto("s_gettargetstate_v", "GTGS");
      cl->addCmdProto("fff_gettargetpos_v", "GTGP");
      cl->addCmdProto("f_gettargetdistance_v", "GTGD");
      cl->addCmdProto("f_gethorizontaltargetdistance_v", "GHTD");
      cl->addCmdProto("f_getverticaltargetdistance_v", "GVTD");
      cl->addCmdProto("f_gettargetangle_v", "GTGA");
      cl->addCmdProto("f_gethorizontaltargetangle_v", "GHTA");
      cl->addCmdProto("f_getverticaltargetangle_v", "GVTA");
      cl->addCmdProto("v_clearsearchtargetclasses_v", "CSTC");
      cl->addCmdProto("v_addsearchtargetclass_s", "ASTC");
      cl->addCmdProto("s_getfirstsearchtargetclass_v", "GFSC");
      cl->addCmdProto("s_getnextsearchtargetclass_s", "GNSC");
      cl->addCmdProto("v_setsearchtargetdist_f", "SSTD");
      cl->addCmdProto("f_getsearchtargetdist_v", "GSTD");
      cl->addCmdProto("v_setsearchtargetkind_s", "SSTK");
      cl->addCmdProto("s_getsearchtargetkind_v", "GSTK");
      cl->addCmdProto("v_setsearchtargetbyangle_b", "SSBA");
      cl->addCmdProto("b_getsearchtargetbyangle_v", "GSBA");
      cl->addCmdProto("b_selectnewcommandlist_s", "SNCL");
      cl->addCmdProto("o_getcurrentcommandlist_v", "GCCL");
      cl->addCmdProto("v_pushtarget_v", "PSHT");
      cl->addCmdProto("v_poptarget_v", "POPT");
      cl->addCmdProto("v_putvehicletargetonstack_s", "PVTS");
      cl->addCmdProto("v_putvehicletargetonstack2_sfff", "PVT2");
      cl->addCmdProto("v_putpositiontargetonstack_fff", "PPTS");
      cl->addCmdProto("v_pushstate_v", "PSHS");
      cl->addCmdProto("v_popstate_v", "POPS");
      cl->addCmdProto("v_putstateonstack_s", "PSOS");
      cl->addCmdProto("b_testvehicleastarget_s", "TTGT");
      cl->addCmdProto("b_hastarget_v", "HTGT");
      cl->addCmdProto("b_haspositiontarget_v", "HPTG");
      cl->addCmdProto("b_hasvehicletarget_v", "HVTG");
      cl->addCmdProto("b_hastargetchanged_v", "HTGC");
      cl->addCmdProto("b_hasenemytarget_v", "HETG");
      cl->addCmdProto("b_hasguidetarget_v", "HGTG");
      cl->addCmdProto("b_reachedtarget_v", "RDTG");
      cl->addCmdProto("b_istargetreachable_v", "ITGR");
      cl->addCmdProto("b_istargetofclass_s", "ITOC");
      cl->addCmdProto("v_settask_ss", "STSK");
      cl->addCmdProto("v_deletetask_v", "DTSK");
      cl->addCmdProto("ss_gettask_v", "GTSK");
      cl->addCmdProto("v_setcurrentpatrolpoint_i", "SCPP");
      cl->addCmdProto("v_setlastpatrolpoint_i", "SLPP");
      cl->addCmdProto("b_iscommandlistfinished_v", "ICLF");
      cl->addCmdProto("b_doinrun_v", "DOIR");
    }
    { auto* cl = ks.registerStubClass("nvehicle", "nautonom");
      cl->addCmdProto("v_setinsidegarage_b", "SISG");
      cl->addCmdProto("b_isinsidegarage_v", "IISG");
      cl->addCmdProto("v_setvisualizemachinegun_b", "SVMG");
      cl->addCmdProto("b_getvisualizemachinegun_v", "GVMG");
      cl->addCmdProto("v_setleader_o", "SLDR");
      cl->addCmdProto("o_getleader_v", "GLDR");
      cl->addCmdProto("v_setasleader_v", "SASL");
      cl->addCmdProto("b_isleader_v", "ILDR");
      cl->addCmdProto("v_leavesquadron_v", "LSQU");
      cl->addCmdProto("v_setleadername_s", "SLDN");
      cl->addCmdProto("v_attachmember_s", "AMBR");
      cl->addCmdProto("o_getfirstmember_v", "GFMB");
      cl->addCmdProto("o_getnextmember_o", "GNMB");
      cl->addCmdProto("o_getfirstlivingmember_v", "GFLM");
      cl->addCmdProto("o_getnextlivingmember_o", "GNLM");
      cl->addCmdProto("v_formsquadron_f", "FSQU");
      cl->addCmdProto("v_givetargettomembers_b", "GTTM");
      cl->addCmdProto("v_showsquadroninfo_v", "SSQI");
      cl->addCmdProto("v_setvisualizeformationpos_b", "SVFP");
      cl->addCmdProto("v_setvisualizesquadron_b", "SVSQ");
      cl->addCmdProto("v_setfirecommand_b", "SFRC");
      cl->addCmdProto("v_setviewergrab_b", "SVGR");
      cl->addCmdProto("b_getviewergrab_v", "GVGR");
    }
    { auto* cl = ks.registerStubClass("nsammler", "nvehicle");
      cl->addCmdProto("v_setmaxcontainer_f", "SMCT");
      cl->addCmdProto("f_getmaxcontainer_v", "GMCT");
      cl->addCmdProto("v_setcurrentcontainer_f", "SCCT");
      cl->addCmdProto("v_addtocontainer_f", "ATCT");
      cl->addCmdProto("f_getcurrentcontainer_v", "GCCT");
      cl->addCmdProto("b_iscontainerfull_v", "ICFL");
      cl->addCmdProto("b_iscontainerempty_v", "ICEM");
    }
    { auto* cl = ks.registerStubClass("nflak", "nvehicle");
      cl->addCmdProto("v_setbasevector_fff", "SBSV");
      cl->addCmdProto("fff_getbasevector_v", "GBSV");
      cl->addCmdProto("v_setmaxsideangle_f", "SMSA");
      cl->addCmdProto("f_getmaxsideangle_v", "GMSA");
      cl->addCmdProto("v_setmaxupangle_f", "SMUA");
      cl->addCmdProto("f_getmaxupangle_v", "GMUA");
      cl->addCmdProto("v_setmaxdownangle_f", "SMDA");
      cl->addCmdProto("f_getmaxdownangle_v", "GMDA");
    }
    { auto* cl = ks.registerStubClass("nmaennel", "nvehicle");
      cl->addCmdProto("v_setownstation_o", "SOST");
      cl->addCmdProto("o_getownstation_v", "GOST");
      cl->addCmdProto("f_getrellanddistance_v", "GRLD");
      cl->addCmdProto("v_setmenuopen_b", "SMNO");
      cl->addCmdProto("v_registermenuopen_b", "RMNO");
      cl->addCmdProto("v_collectartefact_o", "CLAF");
      cl->addCmdProto("v_insertartefact_s", "INAF");
      cl->addCmdProto("v_insertartefactsave_s", "INFS");
      cl->addCmdProto("b_takeoutartefact_o", "TOAF");
      cl->addCmdProto("v_setmaxartefacts_i", "SMAF");
      cl->addCmdProto("i_getmaxartefacts_v", "GMAF");
      cl->addCmdProto("i_numartefacts_v", "NATS");
      cl->addCmdProto("s_artefactlist_v", "ATFL");
      cl->addCmdProto("v_setusedartefact_s", "SUAF");
      cl->addCmdProto("o_getusedartefact_v", "GUAF");
      cl->addCmdProto("v_setwalkoffset_f", "SWOF");
      cl->addCmdProto("f_getwalkoffset_v", "GWOF");
      cl->addCmdProto("v_setnumartefactcommand_s", "SNAC");
      cl->addCmdProto("s_getnumartefactcommand_v", "GNAC");
      cl->addCmdProto("v_setquickslotcommand_s", "SQSC");
      cl->addCmdProto("s_getquickslotcommand_v", "GQSC");
      cl->addCmdProto("v_setlandvehicle_s", "SLDV");
      cl->addCmdProto("o_getlandvehicle_v", "GLDV");
      cl->addCmdProto("v_setquickslot_s", "SQSL");
      cl->addCmdProto("o_getquickslot_v", "GQSL");
      cl->addCmdProto("o_getquickslotsuccessor_v", "GQSS");
      cl->addCmdProto("b_ismenuopen_v", "IMOP");
      cl->addCmdProto("b_isusingartefact_v", "IUAF");
      cl->addCmdProto("b_islanded_v", "ILND");
      cl->addCmdProto("b_isfalling_v", "IFLG");
      cl->addCmdProto("b_hastradepartner_v", "HTPN");
      cl->addCmdProto("b_intrademode_v", "INTM");
      cl->addCmdProto("v_settradestackbase_fff", "STSB");
      cl->addCmdProto("fff_gettradestackbase_v", "GTSB");
      cl->addCmdProto("v_settradeitemoffset_f", "STIO");
      cl->addCmdProto("f_gettradeitemoffset_v", "GTIO");
      cl->addCmdProto("v_pushtradeitem_o", "PSTI");
      cl->addCmdProto("o_poptradeitem_v", "PPTI");
      cl->addCmdProto("i_numtradeitems_v", "NOTI");
      cl->addCmdProto("v_setcreatingbuilding_b", "SCBD");
      cl->addCmdProto("b_iscreatingbuilding_v", "ICBD");
      cl->addCmdProto("v_setcurrentpossesshouse_s", "SCPH");
      cl->addCmdProto("o_getcurrentpossesshouse_v", "GCPH");
      cl->addCmdProto("b_haspossesshouseproduct_v", "HPHP");
      cl->addCmdProto("v_setpossessingbuilding_b", "SPBL");
      cl->addCmdProto("b_ispossessingbuilding_v", "IPBL");
      cl->addCmdProto("v_setpossessingvehicle_b", "SPVH");
      cl->addCmdProto("b_ispossessingvehicle_v", "IPVH");
      cl->addCmdProto("v_setcanfly_b", "SCFL");
      cl->addCmdProto("b_canfly_v", "CFLY");
      cl->addCmdProto("v_setattachslotlink_is", "SATL");
      cl->addCmdProto("s_getattachslotlink_i", "GATL");
      cl->addCmdProto("v_setattachslottarget_is", "SAST");
      cl->addCmdProto("s_getattachslottarget_i", "GAST");
      cl->addCmdProto("v_clearattachslottarget_i", "CAST");
      cl->addCmdProto("v_setcancelmenuaction_b", "SCMA");
      cl->addCmdProto("v_setcancelbuildaction_b", "SCBA");
      cl->addCmdProto("b_isatartefactstorage_v", "ISAS");
      cl->addCmdProto("b_isinstoragemode_v", "IISM");
      cl->addCmdProto("b_isattransformer_v", "ISAT");
      cl->addCmdProto("b_isintransformmode_v", "IITM");
      cl->addCmdProto("v_unlinkfromstation_v", "UNLK");
      cl->addCmdProto("v_setsavepossesshouse_b", "SSPH");
      cl->addCmdProto("v_settransformactionstarted_b", "STAS");
      cl->addCmdProto("v_resetmaennel_v", "RMNL");
      cl->addCmdProto("v_setboostcharges_i", "SBCH");
      cl->addCmdProto("i_getboostcharges_v", "GBCH");
      cl->addCmdProto("v_setmaxboostcharges_i", "SXBC");
      cl->addCmdProto("i_getmaxboostcharges_v", "GXBC");
      cl->addCmdProto("v_setjumping_b", "SJMP");
      cl->addCmdProto("b_isjumping_v", "ISJP");
      cl->addCmdProto("v_setboostpressed_b", "STBP");
      cl->addCmdProto("b_isboostpressed_v", "ISBP");
      cl->addCmdProto("v_setsaveposition_ffffs", "SSVP");
      cl->addCmdProto("v_restoresavepos_v", "RSTS");
      cl->addCmdProto("b_iswalkingbackwards_v", "IWBW");
      cl->addCmdProto("b_isbackpackfull_v", "IBPF");
      cl->addCmdProto("v_respawn_v", "RSPN");
    }
    { auto* cl = ks.registerStubClass("nmissile", "nautonom");
      cl->addCmdProto("v_setguided_b", "SGDD");
      cl->addCmdProto("b_isguided_v", "IGDD");
    }
    { auto* cl = ks.registerStubClass("nhouse", "ncontainer");
      cl->addCmdProto("b_searchunlockedisland_v", "SULI");
      cl->addCmdProto("b_searchlockedisland_v", "SLOI");
      cl->addCmdProto("b_nearbuildground_v", "NBGD");
      cl->addCmdProto("v_setbuildingclass_s", "SBDC");
      cl->addCmdProto("s_getbuildingclass_v", "GBDC");
      cl->addCmdProto("v_setvisualizepossessarea_b", "SVPA");
      cl->addCmdProto("b_getvisualizepossessarea_v", "GVPA");
      cl->addCmdProto("v_removefromisland_v", "RMFI");
      cl->addCmdProto("b_removebuilding_v", "RMVB");
      cl->addCmdProto("v_setsleepmode_b", "SSMD");
      cl->addCmdProto("b_getsleepmode_v", "GSMD");
      cl->addCmdProto("v_sethousemenuradius_f", "SHMR");
      cl->addCmdProto("f_gethousemenuradius_v", "GHMR");
      cl->addCmdProto("v_sethousemenucentre_fff", "SHMC");
      cl->addCmdProto("fff_gethousemenucentre_v", "GHMC");
      cl->addCmdProto("v_sethousemenuangle_f", "SHMA");
      cl->addCmdProto("f_gethousemenuangle_v", "GHMA");
      cl->addCmdProto("b_isoccupied_v", "ISOC");
      cl->addCmdProto("v_setbuildstation_s", "SBST");
    }
    { auto* cl = ks.registerStubClass("nfactory", "nhouse");
      cl->addCmdProto("v_setbuildcounter_if", "SBCT");
      cl->addCmdProto("f_getbuildcounter_i", "GBCT");
      cl->addCmdProto("v_setbuilding_ib", "SBLD");
      cl->addCmdProto("b_getbuilding_i", "GBLD");
      cl->addCmdProto("v_setproductcount_ii", "SPCT");
      cl->addCmdProto("i_getproductcount_i", "GPCT");
      cl->addCmdProto("v_setproductname_is", "SPRN");
      cl->addCmdProto("o_getproduct_i", "GPRN");
      cl->addCmdProto("b_destroyproduct_i", "DPRD");
      cl->addCmdProto("b_isworking_v", "ISWK");
      cl->addCmdProto("v_setfastbuild_b", "SFBD");
      cl->addCmdProto("b_isfastbuild_v", "IFBD");
    }
    { auto* cl = ks.registerStubClass("npawnshop", "nfactory");
      cl->addCmdProto("v_setmaxpricedelta_i", "SMPD");
      cl->addCmdProto("i_getmaxpricedelta_v", "GMPD");
      cl->addCmdProto("b_ismaennelinside_v", "ISMI");
      cl->addCmdProto("v_settradefinished_b", "STFI");
      cl->addCmdProto("b_istradefinished_v", "ITFI");
      cl->addCmdProto("v_settradecancelled_b", "STCA");
      cl->addCmdProto("b_istradecancelled_v", "ITCA");
      cl->addCmdProto("b_iscontentmentlevel1_v", "ICL1");
      cl->addCmdProto("b_iscontentmentlevel2_v", "ICL2");
      cl->addCmdProto("b_iscontentmentlevel3_v", "ICL3");
      cl->addCmdProto("v_resetcontentmentflags_v", "RCMF");
    }
    { auto* cl = ks.registerStubClass("ngarage", "nfactory");
      cl->addCmdProto("v_setapproachpos_fff", "SAPP");
      cl->addCmdProto("fff_getapproachpos_v", "GAPP");
      cl->addCmdProto("fff_getglobalapproachpos_v", "GGAP");
      cl->addCmdProto("v_setvisualizegarage_b", "SVGR");
      cl->addCmdProto("b_getvisualizegarage_v", "GVGR");
      cl->addCmdProto("v_setappearposname_s", "SAPN");
      cl->addCmdProto("s_getappearposname_v", "GAPN");
      cl->addCmdProto("v_setremoveposname_s", "SRPN");
      cl->addCmdProto("s_getremoveposname_v", "GRPN");
      cl->addCmdProto("fff_getremovepos_v", "GRPS");
      cl->addCmdProto("fff_getremovedir_v", "GRDR");
      cl->addCmdProto("fff_getappearpos_v", "GAPS");
      cl->addCmdProto("fff_getappeardir_v", "GADR");
      cl->addCmdProto("v_setoutputvehicle_b", "SOPV");
      cl->addCmdProto("b_isoutputvehicle_v", "ISPV");
    }
    { auto* cl = ks.registerStubClass("nislanddrive", "nhouse");
      cl->addCmdProto("v_switchoffengine_v", "SOEN");
    }
    { auto* cl = ks.registerStubClass("nartefactstorage", "nhouse");
      cl->addCmdProto("v_setcapacity_i", "SCPY");
      cl->addCmdProto("v_getcapacity_v", "GCPY");
      cl->addCmdProto("b_insertartefact_s", "INSA");
      cl->addCmdProto("v_setstackbase_fff", "SSBS");
      cl->addCmdProto("fff_getstackbase_v", "GSBS");
      cl->addCmdProto("v_setloadmode_i", "SLDM");
      cl->addCmdProto("i_getloadmode_v", "GLDM");
      cl->addCmdProto("v_emptystorage_v", "EMST");
    }
    { auto* cl = ks.registerStubClass("nartefacttransformer", "nhouse");
      cl->addCmdProto("v_setdownanim_b", "SDAN");
      cl->addCmdProto("b_isdownanim_v", "IDAN");
      cl->addCmdProto("v_setstackbase_fff", "SSBS");
      cl->addCmdProto("fff_getstackbase_v", "GSBS");
      cl->addCmdProto("v_setsuccessfx_s", "SSFX");
      cl->addCmdProto("s_getsuccessfx_v", "GSFX");
    }
    { auto* cl = ks.registerStubClass("nnavpoint", "ncontainer");
      cl->addCmdProto("v_enable_v", "ENBL");
      cl->addCmdProto("v_disable_v", "DSBL");
      cl->addCmdProto("b_isenabled_v", "ISEN");
      cl->addCmdProto("v_setvisualization_s", "STVZ");
      cl->addCmdProto("s_getvisualization_v", "GTVZ");
    }
    { auto* cl = ks.registerStubClass("nsubtitle", "ncontainer");
      cl->addCmdProto("v_setbitmappath_s", "SBMP");
      cl->addCmdProto("s_getbitmappath_v", "GBMP");
      cl->addCmdProto("v_setvoicepath_s", "SVCP");
      cl->addCmdProto("s_getvoicepath_v", "GVCP");
      cl->addCmdProto("v_setvoicecarrier_s", "SVCC");
      cl->addCmdProto("s_getvoicecarrier_v", "GVCC");
    }
    { auto* cl = ks.registerStubClass("nmodartefact", "ncontainer");
      cl->addCmdProto("v_setmodnumber_i", "SMDN");
      cl->addCmdProto("i_getmodnumber_v", "GMDN");
      cl->addCmdProto("v_setmodmaximum_i", "SMDM");
      cl->addCmdProto("i_getmodmaximum_v", "GMDM");
      cl->addCmdProto("v_setmodparameter_s", "SMDP");
      cl->addCmdProto("s_getmodparameter_v", "GMDP");
    }
    { auto* cl = ks.registerStubClass("nservice", "nroot");
    }
    { auto* cl = ks.registerStubClass("nservicedata", "nroot");
    }
    { auto* cl = ks.registerStubClass("ncollidedata", "nservicedata");
    }
    { auto* cl = ks.registerStubClass("nreplenish", "nservice");
      cl->addCmdProto("v_setrepairfillrate_f", "SRFR");
      cl->addCmdProto("f_getreoairfillrate_v", "GRFR");
      cl->addCmdProto("v_setrepaircost_f", "SRCO");
      cl->addCmdProto("f_getrepaircost_v", "GRCO");
    }
    { auto* cl = ks.registerStubClass("ntimer", "nservice");
    }
    { auto* cl = ks.registerStubClass("nfireweapon", "nservice");
    }
    { auto* cl = ks.registerStubClass("nfiremissile", "nfireweapon");
      cl->addCmdProto("v_setshotdelay_f", "SSTD");
      cl->addCmdProto("f_getshotdelay_v", "GSTD");
      cl->addCmdProto("v_setstartspeed_f", "SSSP");
      cl->addCmdProto("f_getstartspeed_v", "GSSP");
      cl->addCmdProto("v_setshotdirection_fff", "SSDI");
      cl->addCmdProto("fff_getshotdirection_v", "GSDI");
      cl->addCmdProto("v_setweaponproto_s", "SWPP");
      cl->addCmdProto("s_getweaponproto_v", "GWPP");
      cl->addCmdProto("b_addweapon_fff", "AWPN");
      cl->addCmdProto("v_deleteweapons_v", "DWPN");
      cl->addCmdProto("v_setnummissiles_i", "SNUM");
      cl->addCmdProto("i_getnummissiles_v", "GNUM");
      cl->addCmdProto("v_setspreadangle_f", "SSPR");
      cl->addCmdProto("f_getspreadangle_v", "GSPR");
      cl->addCmdProto("v_setvirtualorigin_fff", "SVOR");
      cl->addCmdProto("v_getvirtualorigin_fff", "GVOR");
    }
    { auto* cl = ks.registerStubClass("nfiremachinegun", "nfireweapon");
      cl->addCmdProto("v_setmgradius_f", "SMGR");
      cl->addCmdProto("f_getmgradius_v", "GMGR");
      cl->addCmdProto("v_setmgendradius_f", "SMGE");
      cl->addCmdProto("f_getmgendradius_v", "GMGE");
      cl->addCmdProto("f_getchangemgradius_v", "GCMR");
      cl->addCmdProto("v_setshotdistance_f", "SSDT");
      cl->addCmdProto("f_getshotdistance_v", "GSDT");
      cl->addCmdProto("v_setmgspeed_f", "SMGS");
      cl->addCmdProto("f_getmgspeed_v", "GMGS");
      cl->addCmdProto("v_setdamage_f", "SDMG");
      cl->addCmdProto("f_getdamage_v", "GDMG");
      cl->addCmdProto("s_getdamagetype_v", "GDMT");
      cl->addCmdProto("v_setdamagetype_s", "SDMT");
      cl->addCmdProto("v_setreach_f", "SRCH");
      cl->addCmdProto("f_getreach_v", "GRCH");
      cl->addCmdProto("v_beginbarrels_i", "BGBR");
      cl->addCmdProto("v_setbarrelpos_ifff", "SBRP");
      cl->addCmdProto("v_endbarrels_v", "EDBR");
    }
    { auto* cl = ks.registerStubClass("nbehaviour", "nservice");
    }
    { auto* cl = ks.registerStubClass("npowersupply", "nservice");
      cl->addCmdProto("v_setpowerpersecond_f", "SPPS");
      cl->addCmdProto("f_getpowerpersecond_v", "GPPS");
    }
    { auto* cl = ks.registerStubClass("nwatchtarget", "nservice");
      cl->addCmdProto("v_setremoveartefacttarget_b", "SRAT");
    }
    { auto* cl = ks.registerStubClass("nsquadronwatchtarget", "nwatchtarget");
      cl->addCmdProto("v_setforgettargetdistance_f", "SFTD");
      cl->addCmdProto("f_getforgettargetdistance_v", "GFTD");
      cl->addCmdProto("v_setforgettargetangle_f", "SFTA");
      cl->addCmdProto("f_getforgettargetangle_v", "GFTA");
    }
    { auto* cl = ks.registerStubClass("nattack", "nsquadronwatchtarget");
      cl->addCmdProto("v_setshotdist_f", "SSTD");
      cl->addCmdProto("f_getshotdist_v", "GSTD");
      cl->addCmdProto("v_setshotangle_f", "SSTA");
      cl->addCmdProto("f_getshotangle_v", "GSTA");
      cl->addCmdProto("v_setattackall_b", "SATA");
      cl->addCmdProto("b_getattackall_v", "GATA");
      cl->addCmdProto("v_setweaponradius_f", "SWRD");
      cl->addCmdProto("f_getweaponradius_v", "GWRD");
    }
    { auto* cl = ks.registerStubClass("nweather", "nservice");
    }
    { auto* cl = ks.registerStubClass("ncollectore", "nsquadronwatchtarget");
      cl->addCmdProto("v_setcollectpersecond_f", "SCPS");
      cl->addCmdProto("f_getcollectpersecond_v", "GCPS");
    }
    { auto* cl = ks.registerStubClass("nunloadore", "nbehaviour");
      cl->addCmdProto("v_setunloadpersecond_f", "SUPS");
      cl->addCmdProto("f_getunloadpersecond_v", "GUPS");
    }
    { auto* cl = ks.registerStubClass("nphysics", "nservice");
      cl->addCmdProto("v_setignorestability_b", "IGNS");
      cl->addCmdProto("b_getignorestability_v", "GSTS");
      cl->addCmdProto("v_setignorebuoyancy_b", "IGNB");
      cl->addCmdProto("b_getignorebuoyancy_v", "GBYS");
      cl->addCmdProto("v_setignoreforces_b", "IGNF");
      cl->addCmdProto("b_getignoreforces_v", "GFCS");
    }
    { auto* cl = ks.registerStubClass("nviewerdata", "nservice");
      cl->addCmdProto("v_setcarriernode_s", "SCND");
      cl->addCmdProto("s_getcarriernode_v", "GCND");
      cl->addCmdProto("v_setwatchnode_s", "SWND");
      cl->addCmdProto("s_getwatchnode_v", "GWND");
      cl->addCmdProto("v_setnoderoot_s", "SNRT");
      cl->addCmdProto("s_getnoderoot_v", "GNRT");
    }
    { auto* cl = ks.registerStubClass("nvehicleemitter", "nservice");
      cl->addCmdProto("v_addvehicle_sf", "ADDV");
      cl->addCmdProto("v_setloop_b", "STLP");
      cl->addCmdProto("v_setrandomoffset_b", "STRO");
      cl->addCmdProto("v_setemittingspeed_f", "SEMS");
      cl->addCmdProto("f_getemittingspeed_v", "GEMS");
      cl->addCmdProto("v_setspreadangle_f", "SSPA");
      cl->addCmdProto("f_getspreadangle_v", "GSPA");
    }
    { auto* cl = ks.registerStubClass("nmoving", "nservice");
      cl->addCmdProto("v_setallowmove_b", "SAMV");
      cl->addCmdProto("b_getallowmove_v", "GAMV");
      cl->addCmdProto("v_setallowrotate_b", "SART");
      cl->addCmdProto("b_getallowrotate_v", "GART");
    }
    { auto* cl = ks.registerStubClass("nflakmoving", "nmoving");
    }
    { auto* cl = ks.registerStubClass("nvisual", "nservice");
      cl->addCmdProto("v_setvisual_s", "SVIS");
      cl->addCmdProto("s_getvisual_v", "GVIS");
      cl->addCmdProto("v_setcharstate_s", "SCHS");
      cl->addCmdProto("s_getcharstate_v", "GCHS");
      cl->addCmdProto("v_setanimfinishednode_s", "SAFN");
      cl->addCmdProto("s_getanimfinishednode_v", "GAFN");
    }
    { auto* cl = ks.registerStubClass("nsubtitlevisual", "nvisual");
    }
    { auto* cl = ks.registerStubClass("nmgrender", "nanimnode");
      cl->addCmdProto("v_settracerlen_f", "STRL");
      cl->addCmdProto("f_gettracerlen_v", "GTRL");
      cl->addCmdProto("v_settracerradius_f", "STRR");
      cl->addCmdProto("f_gettracerradius_v", "GTRR");
      cl->addCmdProto("v_setglowradius_f", "SGLR");
      cl->addCmdProto("f_getglowradius_v", "GGLR");
      cl->addCmdProto("v_settracercolor_ffff", "STRC");
      cl->addCmdProto("ffff_gettracercolor_v", "GTRC");
      cl->addCmdProto("v_setsplattersize_f", "SSPS");
      cl->addCmdProto("f_getsplattersize_v", "GSPS");
      cl->addCmdProto("v_setsplattertime_f", "SSPT");
      cl->addCmdProto("f_getsplattertime_v", "GSPT");
      cl->addCmdProto("v_setsplatterspeed_f", "SSSP");
      cl->addCmdProto("f_getsplatterspeed_v", "GSSP");
      cl->addCmdProto("v_setsplattercolor_ffff", "SSPC");
      cl->addCmdProto("ffff_getsplattercolor_v", "GSPC");
    }
    { auto* cl = ks.registerStubClass("naudio", "nservice");
      cl->addCmdProto("v_setaudio_s", "SAUD");
      cl->addCmdProto("s_getaudio_v", "GAUD");
    }
    { auto* cl = ks.registerStubClass("nsubtitleaudio", "naudio");
    }
    { auto* cl = ks.registerStubClass("nmenu", "nservice");
      cl->addCmdProto("v_setitemdistance_f", "SIDS");
      cl->addCmdProto("f_getitemdistance_v", "GIDS");
      cl->addCmdProto("v_setmenuradius_f", "SMRD");
      cl->addCmdProto("f_getmenuradius_v", "GMRD");
      cl->addCmdProto("v_setitemspeed_f", "SISP");
      cl->addCmdProto("f_getitemspeed_v", "GISP");
      cl->addCmdProto("v_setthrowawaydistance_f", "STAD");
      cl->addCmdProto("f_getthrowawaydistance_v", "GTAD");
    }
    { auto* cl = ks.registerStubClass("nstandardmenu", "nmenu");
    }
    { auto* cl = ks.registerStubClass("ntrademenu", "nmenu");
    }
    { auto* cl = ks.registerStubClass("nstoragemenu", "nmenu");
    }
    { auto* cl = ks.registerStubClass("ntransformmenu", "nmenu");
    }
    { auto* cl = ks.registerStubClass("nhousemenu", "nmenu");
    }
    { auto* cl = ks.registerStubClass("ncollectartefact", "nservice");
      cl->addCmdProto("v_setcollectdistance_f", "SCDI");
      cl->addCmdProto("f_getcollectdistance_v", "GCDI");
    }
    { auto* cl = ks.registerStubClass("nbuild", "nservice");
      cl->addCmdProto("v_setbuildtime_f", "SBTM");
      cl->addCmdProto("f_getbuildtime_v", "GBTM");
      cl->addCmdProto("v_setbuildenergy_f", "SBEN");
      cl->addCmdProto("f_getbuildenergy_v", "GBEN");
      cl->addCmdProto("v_setbuildproduct_s", "SBPR");
      cl->addCmdProto("s_getbuildproduct_v", "GBPR");
      cl->addCmdProto("v_setmaxproducts_i", "SMPR");
      cl->addCmdProto("i_getmaxproducts_v", "GMPR");
      cl->addCmdProto("v_setbuildrelpos_fff", "SBRP");
      cl->addCmdProto("fff_getbuildrelpos_v", "GBRP");
      cl->addCmdProto("v_setinitcommand_s", "SICM");
      cl->addCmdProto("s_getinitcommand_v", "GICM");
      cl->addCmdProto("v_setslotid_i", "SSID");
      cl->addCmdProto("i_getslotid_v", "GSID");
    }
    { auto* cl = ks.registerStubClass("nbuildartefact", "nbuild");
    }
    { auto* cl = ks.registerStubClass("nbuildtradeartefact", "nbuildartefact");
    }
    { auto* cl = ks.registerStubClass("nbuildvehicle", "nbuild");
    }
    { auto* cl = ks.registerStubClass("nbuildflak", "nbuild");
    }
    { auto* cl = ks.registerStubClass("ninterpolate", "nservice");
      cl->addCmdProto("v_setipolduration_f", "SIPD");
      cl->addCmdProto("v_setdoipolpos_b", "SDIP");
      cl->addCmdProto("b_getdoipolpos_v", "GDIP");
      cl->addCmdProto("v_setdoipoldir_b", "SDID");
      cl->addCmdProto("b_getdoipoldir_v", "GDID");
    }
    { auto* cl = ks.registerStubClass("nipolapproachgarage", "ninterpolate");
    }
    { auto* cl = ks.registerStubClass("nuseartefact", "nservice");
    }
    { auto* cl = ks.registerStubClass("nplacehouse", "nuseartefact");
      cl->addCmdProto("v_setlockgrid_b", "SLGD");
      cl->addCmdProto("b_getlockgrid_v", "GLGD");
    }
    { auto* cl = ks.registerStubClass("nwatchusingartefact", "nservice");
    }
    { auto* cl = ks.registerStubClass("nconsumption", "nservice");
      cl->addCmdProto("v_setconsumption_f", "SCMP");
      cl->addCmdProto("f_getconsumption_v", "GCMP");
    }
    { auto* cl = ks.registerStubClass("nsilo", "nservice");
      cl->addCmdProto("v_setcapacity_f", "SCAP");
      cl->addCmdProto("f_getcapacity_v", "GCAP");
    }
    { auto* cl = ks.registerStubClass("nstatewatch", "nservice");
      cl->addCmdProto("v_settimeout_f", "STOU");
      cl->addCmdProto("f_gettimeout_v", "GTOU");
      cl->addCmdProto("v_addactivatecommand_s", "AACC");
      cl->addCmdProto("v_deleteactivatecommands_v", "DACC");
      cl->addCmdProto("v_adddeactivatecommand_s", "ADEC");
      cl->addCmdProto("v_deletedeactivatecommands_v", "DDEC");
      cl->addCmdProto("v_setwatchcommand_s", "SWAC");
      cl->addCmdProto("s_getwatchcommand_v", "GWAC");
      cl->addCmdProto("v_setrandomtimemodifier_f", "RTMD");
      cl->addCmdProto("f_gettimemodifierpercentage_v", "GTMP");
      cl->addCmdProto("v_setcommandlistpath_s", "SCLP");
      cl->addCmdProto("s_getcommandlistpath_v", "GCLP");
    }
    { auto* cl = ks.registerStubClass("ncommandlist", "nroot");
    }
    { auto* cl = ks.registerStubClass("nengine2", "nservice");
      cl->addCmdProto("v_setlookattarget_f", "SLAT");
      cl->addCmdProto("f_getlookattarget_v", "GLAT");
      cl->addCmdProto("v_setgravityfactor_f", "SGRF");
      cl->addCmdProto("f_getgravityfactor_v", "GGRF");
      cl->addCmdProto("v_setupright_b", "SUPR");
      cl->addCmdProto("b_getupright_v", "GUPR");
      cl->addCmdProto("v_setconsiderfallflag_b", "SCFF");
      cl->addCmdProto("b_getconsiderfallflag_v", "GCFF");
    }
    { auto* cl = ks.registerStubClass("nsimpleengine2", "nengine2");
      cl->addCmdProto("v_setmaxspeed_f", "SMSP");
      cl->addCmdProto("f_getmaxspeed_v", "GMSP");
      cl->addCmdProto("v_setmaxspeedtime_f", "SMST");
      cl->addCmdProto("f_getmaxspeedtime_v", "GMST");
      cl->addCmdProto("v_setmaxrise_f", "SMRS");
      cl->addCmdProto("f_getmaxrise_v", "GMRS");
      cl->addCmdProto("v_setmaxrisetime_f", "SMRT");
      cl->addCmdProto("f_getmaxrisetime_v", "GMRT");
      cl->addCmdProto("v_setradius_f", "SMRD");
      cl->addCmdProto("f_getradius_v", "GMRD");
      cl->addCmdProto("v_setradiustime_f", "SMDT");
      cl->addCmdProto("f_getradiustime_v", "GMDT");
    }
    { auto* cl = ks.registerStubClass("nmaennelwalk2", "nengine2");
      cl->addCmdProto("v_setmaxspeed_f", "SMXS");
      cl->addCmdProto("f_getmaxspeed_v", "GMXS");
      cl->addCmdProto("v_setmaxbackspeed_f", "SMXB");
      cl->addCmdProto("f_getmaxbackspeed_v", "GMXB");
      cl->addCmdProto("v_setcurveradius_f", "SCVR");
      cl->addCmdProto("f_getcurveradius_v", "GCVR");
      cl->addCmdProto("v_setcurveradiustime_f", "SCRT");
      cl->addCmdProto("f_getcurveradiustime_v", "GCRT");
      cl->addCmdProto("v_setskidspeed_f", "SSKS");
      cl->addCmdProto("f_getskidspeed_v", "GSKS");
      cl->addCmdProto("v_setmaxwalkableangle_f", "SMWA");
      cl->addCmdProto("f_getmaxwalkableangle_v", "GMWA");
    }
    { auto* cl = ks.registerStubClass("njumpengine", "nservice");
    }
    { auto* cl = ks.registerStubClass("ncollcheck2", "nservice");
      cl->addCmdProto("v_setshape_s", "SSHP");
      cl->addCmdProto("s_getshape_v", "GSHP");
      cl->addCmdProto("v_setcollclass_s", "SCLC");
      cl->addCmdProto("s_getcollclass_v", "GCLC");
      cl->addCmdProto("v_setradius_f", "SRAD");
      cl->addCmdProto("f_getradius_v", "GRAD");
    }
    { auto* cl = ks.registerStubClass("ncollhandle2", "nservice");
      cl->addCmdProto("v_sethandlebounce_b", "SBNC");
      cl->addCmdProto("b_gethandlebounce_v", "GBNC");
      cl->addCmdProto("v_sethandledamage_b", "SDMG");
      cl->addCmdProto("b_gethandledamage_v", "GDMG");
      cl->addCmdProto("v_setclassfilter_s", "SCLF");
      cl->addCmdProto("s_getclassfilter_v", "GCLF");
    }
    { auto* cl = ks.registerStubClass("nmissilecollhandle", "nservice");
    }
    { auto* cl = ks.registerStubClass("ncrittercollhandle", "ncollhandle2");
      cl->addCmdProto("v_addvictimclass_s", "AVCL");
      cl->addCmdProto("v_setcollaction_s", "SCAC");
      cl->addCmdProto("s_getcollaction_v", "GCAC");
    }
    { auto* cl = ks.registerStubClass("nwalkovercheck", "ncollcheck2");
    }
    { auto* cl = ks.registerStubClass("nwalkoverhandle", "ncollhandle2");
    }
    { auto* cl = ks.registerStubClass("nmnlcollhandle2", "ncollhandle2");
      cl->addCmdProto("v_addcollclass_s", "ADCC");
      cl->addCmdProto("i_getnumcollclasses_v", "GNCC");
      cl->addCmdProto("s_getcollclass_i", "GTCC");
      cl->addCmdProto("v_setallowlanding_b", "SALL");
      cl->addCmdProto("b_getallowlanding_v", "GALL");
    }
    { auto* cl = ks.registerStubClass("nstationcollhandle2", "ncollhandle2");
    }
    { auto* cl = ks.registerStubClass("nwalkcollhandle2", "nmnlcollhandle2");
      cl->addCmdProto("v_setmaxstepheight_f", "SMSH");
      cl->addCmdProto("f_getmaxstepheight_v", "GMSH");
      cl->addCmdProto("v_setmaxwalkableangle_f", "SMWA");
      cl->addCmdProto("f_getmaxwalkableangle_v", "GMWA");
      cl->addCmdProto("v_setjumpcheckheight_f", "SJCH");
      cl->addCmdProto("f_getjumpcheckheight_v", "GJCH");
      cl->addCmdProto("v_setjumpchecklen_f", "SJCL");
      cl->addCmdProto("f_getjumpchecklen_v", "GJCL");
    }
    { auto* cl = ks.registerStubClass("nflakengine2", "nengine2");
      cl->addCmdProto("v_setmaxhorirotation_f", "SMHR");
      cl->addCmdProto("f_getmaxhorirotation_v", "GMHR");
      cl->addCmdProto("v_sethorirotationtime_f", "SHRT");
      cl->addCmdProto("f_gethorirotationtime_v", "GHRT");
      cl->addCmdProto("v_setmaxvertrotation_f", "SMVR");
      cl->addCmdProto("f_getmaxvertrotation_v", "GMVR");
      cl->addCmdProto("v_setvertrotationtime_f", "SVRT");
      cl->addCmdProto("f_getvertrotationtime_v", "GVRT");
    }
    { auto* cl = ks.registerStubClass("nmissileengine2", "nengine2");
      cl->addCmdProto("v_setmaxspeed_f", "SMSP");
      cl->addCmdProto("f_getmaxspeed_v", "GMSP");
      cl->addCmdProto("v_setmaxspeedtime_f", "SMST");
      cl->addCmdProto("f_getmaxspeedtime_v", "GMST");
      cl->addCmdProto("v_setstoptime_f", "SSPT");
      cl->addCmdProto("f_getstoptime_v", "GSPT");
      cl->addCmdProto("v_setturnradius_f", "STRD");
      cl->addCmdProto("f_getturnradius_v", "GTRD");
      cl->addCmdProto("v_setturnradiustime_f", "STNT");
      cl->addCmdProto("f_getturnradiustime_v", "GTNT");
    }
    { auto* cl = ks.registerStubClass("nstationengine", "nengine2");
    }
    { auto* cl = ks.registerStubClass("nbuoyancy", "nservice");
      cl->addCmdProto("v_setrely_f", "SRLY");
      cl->addCmdProto("f_getrely_v", "GRLY");
      cl->addCmdProto("v_setminradius_f", "SMIR");
      cl->addCmdProto("f_getminradius_v", "GMIR");
      cl->addCmdProto("v_setmaxradius_f", "SMAR");
      cl->addCmdProto("f_getmaxradius_v", "GMAR");
      cl->addCmdProto("v_setheight_f", "SHGT");
      cl->addCmdProto("f_getheight_v", "GHGT");
      cl->addCmdProto("v_setbuoyancy_f", "SBUO");
      cl->addCmdProto("f_getbuoyancy_v", "GBUO");
      cl->addCmdProto("v_setattraction_f", "SATR");
      cl->addCmdProto("f_getattraction_v", "GATR");
      cl->addCmdProto("v_setwavelen_f", "SWVL");
      cl->addCmdProto("f_getwavelen_v", "GWVL");
      cl->addCmdProto("v_setperiodduration_f", "SPDR");
      cl->addCmdProto("f_getperiodduration_v", "GPDR");
      cl->addCmdProto("v_setamplitude_f", "SAMP");
      cl->addCmdProto("f_getamplitude_v", "GAMP");
      cl->addCmdProto("v_settorque_f", "STRQ");
      cl->addCmdProto("f_gettorque_v", "GTRQ");
    }
    { auto* cl = ks.registerStubClass("navoidcollision", "nservice");
      cl->addCmdProto("v_setsmallradius_f", "SSMR");
      cl->addCmdProto("f_getsmallradius_v", "GSMR");
      cl->addCmdProto("v_setignoresmallobjects_b", "SISO");
      cl->addCmdProto("b_getignoresmallobjects_v", "GISO");
      cl->addCmdProto("v_setkamikaze_b", "SKKZ");
      cl->addCmdProto("b_getkamikaze_v", "GKKZ");
      cl->addCmdProto("v_setavoidradius_f", "SAVR");
      cl->addCmdProto("f_getavoidradius_v", "GAVR");
    }
    { auto* cl = ks.registerStubClass("nplacespellaction", "nuseartefact");
      cl->addCmdProto("v_setspellaction_s", "SSPA");
      cl->addCmdProto("s_getspellaction_v", "GSPA");
      cl->addCmdProto("v_setalternatedistance_f", "SADS");
      cl->addCmdProto("f_getalternatedistance_v", "GADS");
      cl->addCmdProto("v_setownercommand_s", "SOWC");
      cl->addCmdProto("s_getownercommand_v", "GOWC");
      cl->addCmdProto("v_setplacement_s", "SPLM");
      cl->addCmdProto("s_getplacement_v", "GPLM");
      cl->addCmdProto("v_setstartdistance_f", "SSTD");
      cl->addCmdProto("f_getstartdistance_v", "GSTD");
    }
    { auto* cl = ks.registerStubClass("nsimplespell", "nuseartefact");
      cl->addCmdProto("v_setspellcommand_s", "SSPC");
      cl->addCmdProto("s_getspellcommand_v", "GSPC");
    }
    { auto* cl = ks.registerStubClass("nenergyeffect", "nservice");
      cl->addCmdProto("v_setsingleeffect_b", "SSDM");
      cl->addCmdProto("b_getsingleeffect_v", "GSDM");
      cl->addCmdProto("v_setradius_f", "SXPR");
      cl->addCmdProto("f_getradius_v", "GXPR");
      cl->addCmdProto("v_setenergy_f", "SXPE");
      cl->addCmdProto("f_getenergy_v", "GXPE");
    }
    { auto* cl = ks.registerStubClass("nexplosion", "nenergyeffect");
      cl->addCmdProto("v_setdamagetype_s", "SDTP");
      cl->addCmdProto("s_getdamagetype_v", "GDTP");
      cl->addCmdProto("v_setbasedebris_s", "SDBR");
      cl->addCmdProto("s_getbasedebris_v", "GDBR");
      cl->addCmdProto("v_setenergyclot_s", "SECL");
      cl->addCmdProto("s_getenergyclot_v", "GECL");
      cl->addCmdProto("v_adddebris_sfffffff", "ADBR");
    }
    { auto* cl = ks.registerStubClass("nheal", "nenergyeffect");
    }
    { auto* cl = ks.registerStubClass("ncinematicplayer", "nservice");
    }
    { auto* cl = ks.registerStubClass("nsubtitleplayer", "ncinematicplayer");
    }
    { auto* cl = ks.registerStubClass("ncharcinematicplayer", "ncinematicplayer");
    }
    { auto* cl = ks.registerStubClass("nengine3", "nservice");
    }
    { auto* cl = ks.registerStubClass("nstationengine3", "nservice");
      cl->addCmdProto("v_setdrivestoptime_f", "SDST");
      cl->addCmdProto("f_getdrivestoptime_v", "GDST");
    }
    { auto* cl = ks.registerStubClass("nairplane3", "nengine3");
      cl->addCmdProto("v_setminspeed_f", "SISP");
      cl->addCmdProto("f_getminspeed_v", "GISP");
      cl->addCmdProto("v_setmaxspeed_f", "SXSP");
      cl->addCmdProto("f_getmaxspeed_v", "GXSP");
      cl->addCmdProto("v_setacceltime_f", "SATM");
      cl->addCmdProto("f_getacceltime_v", "GATM");
      cl->addCmdProto("v_setdeceltime_f", "SDTM");
      cl->addCmdProto("f_getdeceltime_v", "GDTM");
      cl->addCmdProto("v_setmaxyawrotation_f", "SXYR");
      cl->addCmdProto("f_getmaxyawrotation_v", "GXYR");
      cl->addCmdProto("v_setyawacceltime_f", "SYAT");
      cl->addCmdProto("f_getyawacceltime_v", "GYAT");
      cl->addCmdProto("v_setmaxpitch_f", "SMPI");
      cl->addCmdProto("f_getmaxpitch_v", "GMPI");
      cl->addCmdProto("v_setpitchtime_f", "SMPT");
      cl->addCmdProto("f_getpitchtime_v", "GMPT");
      cl->addCmdProto("v_setmaxroll_f", "SMRL");
      cl->addCmdProto("f_getmaxroll_v", "GMRL");
      cl->addCmdProto("v_setrolltime_f", "SMRT");
      cl->addCmdProto("f_getrolltime_v", "GMRT");
    }
    { auto* cl = ks.registerStubClass("nairship3", "nengine3");
      cl->addCmdProto("v_setmaxspeed_f", "SXSP");
      cl->addCmdProto("f_getmaxspeed_v", "GXSP");
      cl->addCmdProto("v_setacceltime_f", "SATM");
      cl->addCmdProto("f_getacceltime_v", "GATM");
      cl->addCmdProto("v_setdeceltime_f", "SDTM");
      cl->addCmdProto("f_getdeceltime_v", "GDTM");
      cl->addCmdProto("v_setmaxvertspeed_f", "SXVS");
      cl->addCmdProto("f_getmaxvertspeed_v", "GXVS");
      cl->addCmdProto("v_setvertacceltime_f", "SVAT");
      cl->addCmdProto("f_getvertacceltime_v", "GVAT");
      cl->addCmdProto("v_setmaxyawrotation_f", "SXYR");
      cl->addCmdProto("f_getmaxyawrotation_v", "GXYR");
      cl->addCmdProto("v_setyawacceltime_f", "SYAT");
      cl->addCmdProto("f_getyawacceltime_v", "GYAT");
      cl->addCmdProto("v_setmaxroll_f", "SMRL");
      cl->addCmdProto("f_getmaxroll_v", "GMRL");
      cl->addCmdProto("v_setrolltime_f", "SMRT");
      cl->addCmdProto("f_getrolltime_v", "GMRT");
    }
    { auto* cl = ks.registerStubClass("nmaennelengine3", "nairplane3");
      cl->addCmdProto("v_setboosttime_f", "SBOT");
      cl->addCmdProto("f_getboosttime_v", "GBOT");
    }
    { auto* cl = ks.registerStubClass("nswimmingengine", "nengine3");
      cl->addCmdProto("v_setfallspeed_f", "SFSP");
      cl->addCmdProto("f_getfallspeed_v", "GFSP");
      cl->addCmdProto("v_setfallspeedtime_f", "SFST");
      cl->addCmdProto("f_getfallspeedtime_v", "GFST");
      cl->addCmdProto("v_setupliftspeed_f", "SULS");
      cl->addCmdProto("f_getupliftspeed_v", "GULS");
      cl->addCmdProto("v_setmaxyawrotation_f", "SXYR");
      cl->addCmdProto("f_getmaxyawrotation_v", "GXYR");
      cl->addCmdProto("v_setyawacceltime_f", "SYAT");
      cl->addCmdProto("f_getyawacceltime_v", "GYAT");
      cl->addCmdProto("v_setbraketime_f", "SBKT");
      cl->addCmdProto("f_getbraketime_v", "GBKT");
    }
    { auto* cl = ks.registerStubClass("nanimsequence", "nroot");
      cl->addCmdProto("v_setchannelname_is", "SCHN");
      cl->addCmdProto("s_getchannelname_i", "GCHN");
      cl->addCmdProto("v_addtranslate_ffff", "ADTK");
      cl->addCmdProto("v_addrotate_ffff", "ADRK");
      cl->addCmdProto("v_addquaternion_fffff", "ADQK");
      cl->addCmdProto("v_addvisual_fs", "ADVK");
      cl->addCmdProto("v_addaudio_fs", "ADAK");
      cl->addCmdProto("v_addchannel_fif", "ADCH");
      cl->addCmdProto("v_setvehiclerelated_b", "SVRL");
      cl->addCmdProto("b_isvehiclerelated_v", "IVRL");
      cl->addCmdProto("v_setgeneratorproto_s", "SGPT");
      cl->addCmdProto("v_setgeneratorname_s", "SGNM");
      cl->addCmdProto("s_getgeneratorproto_v", "GGPT");
      cl->addCmdProto("s_getgeneratorname_v", "GGNM");
      cl->addCmdProto("v_setidletime_f", "STIT");
      cl->addCmdProto("f_getidletime_v", "GTIT");
    }
    { auto* cl = ks.registerStubClass("nspawnpoint", "ncontainer");
      cl->addCmdProto("v_setclientid_i", "SCID");
      cl->addCmdProto("i_getclientid_v", "GCID");
      cl->addCmdProto("v_setlocked_b", "SLOC");
      cl->addCmdProto("b_islocked_v", "ILOC");
    }
    { auto* cl = ks.registerStubClass("nspawn", "nservice");
    }
    { auto* cl = ks.registerStubClass("nsteer", "nservice");
      cl->addCmdProto("v_setmaxspeed_f", "SXSP");
      cl->addCmdProto("f_getmaxspeed_v", "GXSP");
      cl->addCmdProto("v_setmaxspeedtime_f", "SXST");
      cl->addCmdProto("f_getmaxspeedtime_v", "GXST");
      cl->addCmdProto("v_setmaxlift_f", "SXLF");
      cl->addCmdProto("f_getmaxlift_v", "GXLF");
      cl->addCmdProto("v_setmaxlifttime_f", "SXLT");
      cl->addCmdProto("f_getmaxlifttime_v", "GXLT");
      cl->addCmdProto("v_setmaxrotation_f", "SXRO");
      cl->addCmdProto("f_getmaxrotation_v", "GXRO");
      cl->addCmdProto("v_setmaxrotationtime_f", "SXRT");
      cl->addCmdProto("f_getmaxrotationtime_v", "GXRT");
      cl->addCmdProto("v_settoprotation_f", "STRO");
      cl->addCmdProto("f_gettoprotation_v", "GTRO");
    }
    { auto* cl = ks.registerStubClass("nnavpointsteer", "nsteer");
    }
    { auto* cl = ks.registerStubClass("nfreesteer", "nsteer");
    }
    { auto* cl = ks.registerStubClass("ntestpossess", "nservice");
      cl->addCmdProto("v_setpossesschangedcommand_s", "SPCC");
      cl->addCmdProto("s_getpossesschangedcommand_v", "GPCC");
    }
    { auto* cl = ks.registerStubClass("nquickslotmanager", "nservice");
    }
    { auto* cl = ks.registerStubClass("ndatahandler", "nroot");
      cl->addCmdProto("v_setdatapaths_ss", "SDTP");
      cl->addCmdProto("ss_getdatapaths_v", "GDTP");
      cl->addCmdProto("o_load_s", "LOAD");
      cl->addCmdProto("v_unload_s", "UNLD");
      cl->addCmdProto("b_loadlist_s", "LDLS");
      cl->addCmdProto("b_unloadlist_s", "ULDL");
      cl->addCmdProto("o_loadpermanent_s", "LOAP");
    }
    { auto* cl = ks.registerStubClass("ncookiehandler", "nroot");
      cl->addCmdProto("v_setcookie_ss", "SCKI");
      cl->addCmdProto("s_getcookie_s", "GCKI");
      cl->addCmdProto("b_cookieexists_s", "CKEX");
      cl->addCmdProto("v_clearcookie_s", "CLCK");
      cl->addCmdProto("v_clearcookies_v", "CLRC");
      cl->addCmdProto("v_marktemporary_s", "MTMP");
    }
    { auto* cl = ks.registerStubClass("neventhandler", "nroot");
      cl->addCmdProto("v_clear_v", "CLER");
      cl->addCmdProto("v_addhandler_ss", "REGS");
      cl->addCmdProto("v_addhandler2_ssss", "REG2");
      cl->addCmdProto("v_putevent_s", "PUTE");
      cl->addCmdProto("v_setlogging_b", "SLOG");
      cl->addCmdProto("b_getlogging_v", "GLOG");
    }
    { auto* cl = ks.registerStubClass("nbookhandler", "nroot");
      cl->addCmdProto("b_loadbook_s", "LDBK");
      cl->addCmdProto("b_loadbookquiet_s", "LDBQ");
      cl->addCmdProto("v_unloadbook_v", "ULDB");
      cl->addCmdProto("b_registerpart_sss", "RCHP");
      cl->addCmdProto("b_activatepart_s", "ACTP");
      cl->addCmdProto("b_activatepartquiet_s", "ACPQ");
      cl->addCmdProto("b_activatenextpart_v", "ACNP");
      cl->addCmdProto("s_getcurrentbook_v", "GCRB");
      cl->addCmdProto("s_getcurrentpart_v", "GCRC");
      cl->addCmdProto("s_getcurrentpartdir_v", "GCPD");
    }
    { auto* cl = ks.registerStubClass("nfeedbackhandler", "nroot");
      cl->addCmdProto("v_registerattack_oo", "RGAT");
      cl->addCmdProto("v_registernavpointenabled_v", "RNVE");
      cl->addCmdProto("v_registernavpointreached_v", "RNVR");
      cl->addCmdProto("v_registerindangerzone_v", "RIDZ");
      cl->addCmdProto("v_registerairplanedestroyed_v", "RADY");
      cl->addCmdProto("v_registerbuildingdestroyed_v", "RBDY");
      cl->addCmdProto("v_registerdriveactivated_v", "RDAC");
      cl->addCmdProto("v_registertakencontrol_v", "RTCO");
      cl->addCmdProto("v_registeruse_o", "RUSE");
      cl->addCmdProto("v_registerenergylow_o", "RLOW");
      cl->addCmdProto("v_registernoammunition_o", "RNOA");
      cl->addCmdProto("v_registermaennelcanfly_v", "RMCF");
      cl->addCmdProto("v_registerdrivedeactivated_v", "RDDA");
    }
    { auto* cl = ks.registerStubClass("nsearchhandler", "nroot");
      cl->addCmdProto("v_setmaxwatchdistance_f", "SMSD");
      cl->addCmdProto("f_getmaxwatchdistance_v", "GMSD");
      cl->addCmdProto("v_setmaxwatchangle_f", "SMSA");
      cl->addCmdProto("f_getmaxwatchangle_v", "GMSA");
      cl->addCmdProto("o_getwatched_v", "GWTD");
      cl->addCmdProto("v_setcursor_s", "SCSR");
      cl->addCmdProto("o_getcursor_v", "GCSR");
      cl->addCmdProto("v_sethaircross_s", "SHCR");
      cl->addCmdProto("o_gethaircross_v", "GHCR");
      cl->addCmdProto("v_sethaircrossowner_o", "SHCO");
      cl->addCmdProto("o_gethaircrossowner_v", "GHCO");
    }
    { auto* cl = ks.registerStubClass("nguimenuentry", "nroot");
      cl->addCmdProto("v_setcommand_s", "STCM");
      cl->addCmdProto("s_getcommand_v", "GTCM");
      cl->addCmdProto("v_execute_v", "EXEC");
      cl->addCmdProto("v_setrect_ffff", "STPS");
      cl->addCmdProto("ffff_getrect_v", "GTPS");
      cl->addCmdProto("v_show_v", "ENSH");
      cl->addCmdProto("v_hide_v", "ENHD");
    }
    { auto* cl = ks.registerStubClass("nguistandardmenuentry", "nguimenuentry");
      cl->addCmdProto("v_setmeshname_s", "STMN");
      cl->addCmdProto("s_getmeshname_v", "GTMN");
      cl->addCmdProto("v_setshadername_s", "STSN");
      cl->addCmdProto("s_getshadername_v", "GTSN");
    }
    { auto* cl = ks.registerStubClass("nguicharacterentry", "nguistandardmenuentry");
      cl->addCmdProto("v_setposition_fff", "SPOS");
      cl->addCmdProto("fff_getposition_v", "GPOS");
      cl->addCmdProto("v_setorientation_fff", "SORI");
      cl->addCmdProto("fff_getorientation_v", "GORI");
    }
    { auto* cl = ks.registerStubClass("nguiloadsaveentry", "nguistandardmenuentry");
    }
    { auto* cl = ks.registerStubClass("nguimenu", "nroot");
      cl->addCmdProto("v_up_v", "MNUP");
      cl->addCmdProto("v_down_v", "MNDN");
      cl->addCmdProto("v_left_v", "MNLF");
      cl->addCmdProto("v_right_v", "MNRT");
      cl->addCmdProto("v_open_v", "MNOP");
      cl->addCmdProto("v_close_v", "MNCL");
      cl->addCmdProto("v_settitle_s", "STTL");
      cl->addCmdProto("s_gettitle_v", "GTTL");
      cl->addCmdProto("v_settitlerect_ffff", "STTP");
      cl->addCmdProto("fff_gettitlerect_v", "GTTP");
      cl->addCmdProto("v_setmouseoverselect_b", "SMOS");
      cl->addCmdProto("b_getmouseoverselect_v", "GMOS");
      cl->addCmdProto("v_setabortable_b", "STAB");
      cl->addCmdProto("b_isabortable_v", "ISAB");
      cl->addCmdProto("v_setbackground_s", "SBGR");
      cl->addCmdProto("s_getbackground_v", "GBGR");
      cl->addCmdProto("v_setcancelselects_b", "SCNS");
      cl->addCmdProto("b_getcancelselects_v", "GCNS");
    }
    { auto* cl = ks.registerStubClass("ncritterengine2", "nengine3");
      cl->addCmdProto("v_setmaxspeed_f", "SMXS");
      cl->addCmdProto("f_getmaxspeed_v", "GMXS");
    }
    { auto* cl = ks.registerStubClass("ncritter2", "nvehicle");
      cl->addCmdProto("b_hitvictim_v", "HVCT");
    }
    { auto* cl = ks.registerStubClass("nskritattack", "nservice");
      cl->addCmdProto("v_setinnerdist_f", "SIND");
      cl->addCmdProto("v_setinnerangle_f", "SINA");
      cl->addCmdProto("v_setouterdist_f", "SOUD");
      cl->addCmdProto("v_setouterangle_f", "SOUA");
      cl->addCmdProto("f_getinnerdist_v", "GIND");
      cl->addCmdProto("f_getinnerangle_v", "GINA");
      cl->addCmdProto("f_getouterdist_v", "GOUD");
      cl->addCmdProto("f_getouterangle_v", "GOUA");
      cl->addCmdProto("v_setdamage_f", "SDMG");
      cl->addCmdProto("f_getdamage_v", "GDMG");
      cl->addCmdProto("v_setdamagetype_s", "SDMT");
      cl->addCmdProto("s_getdamagetype_v", "GDMT");
    }
    { auto* cl = ks.registerStubClass("nskritmanager", "nservice");
    }
    { auto* cl = ks.registerStubClass("nguistandardmenu", "nguimenu");
    }
    { auto* cl = ks.registerStubClass("nguipanel", "nguimenu");
      cl->addCmdProto("v_setrect_ffff", "SREC");
      cl->addCmdProto("ffff_getrect_v", "GREC");
      cl->addCmdProto("v_setspacing_ff", "SSPC");
      cl->addCmdProto("ff_getspacing_v", "GSPC");
      cl->addCmdProto("v_setnumentriesx_i", "SNEX");
      cl->addCmdProto("i_getnumentriesx_v", "GNEX");
      cl->addCmdProto("v_setnumentriesy_i", "SNEY");
      cl->addCmdProto("i_getnumentriesy_v", "GNEY");
      cl->addCmdProto("v_setcommand_s", "GLSC");
      cl->addCmdProto("v_setmaxentries_i", "SMEN");
      cl->addCmdProto("i_getmaxentries_v", "GMEN");
    }
    { auto* cl = ks.registerStubClass("nguisessionspanel", "nguipanel");
    }
    { auto* cl = ks.registerStubClass("nguisessionentry", "nguistandardmenuentry");
    }
    { auto* cl = ks.registerStubClass("nswingengine", "nservice");
      cl->addCmdProto("v_setenableswing_b", "SESW");
      cl->addCmdProto("b_getenableswing_v", "GESW");
    }
    { auto* cl = ks.registerStubClass("nguiloadsavepanel", "nguipanel");
      cl->addCmdProto("v_setdirectory_s", "SDIR");
      cl->addCmdProto("s_getdirectory_v", "GDIR");
      cl->addCmdProto("v_setlastsavedslot_i", "SLSS");
      cl->addCmdProto("i_getlastsavedslot_v", "GLSS");
    }
    { auto* cl = ks.registerStubClass("nguimenuhandler", "nroot");
      cl->addCmdProto("v_openmenu_s", "OPMN");
      cl->addCmdProto("v_closemenu_v", "CLMN");
      cl->addCmdProto("v_cancelmenu_v", "CNMN");
      cl->addCmdProto("v_reset_v", "RESM");
      cl->addCmdProto("b_menuopen_v", "MNOP");
      cl->addCmdProto("v_showinfoscreen_s", "SWIS");
      cl->addCmdProto("v_updateinfoscreen_f", "UPIS");
      cl->addCmdProto("v_hideinfoscreen_v", "HDIS");
      cl->addCmdProto("v_showbar_s", "SHBA");
      cl->addCmdProto("v_hidebar_s", "HIBA");
      cl->addCmdProto("v_showallbars_v", "SHAB");
      cl->addCmdProto("v_hideallbars_v", "HIAB");
      cl->addCmdProto("v_showtextmessage_s", "TXTM");
      cl->addCmdProto("v_showuserinfo_v", "SHUI");
      cl->addCmdProto("v_hideuserinfo_v", "HDUI");
      cl->addCmdProto("v_showcredits_sf", "CRED");
      cl->addCmdProto("b_creditsshown_v", "CRSH");
      cl->addCmdProto("v_showhelpscreen_v", "SHLP");
      cl->addCmdProto("v_hidehelpscreen_v", "HHLP");
    }
    { auto* cl = ks.registerStubClass("ntaskmanager", "nservice");
    }
    { auto* cl = ks.registerStubClass("nfightermanager", "ntaskmanager");
    }
    { auto* cl = ks.registerStubClass("nsammlermanager", "ntaskmanager");
    }
    { auto* cl = ks.registerStubClass("ndistancechecker", "nservice");
    }
    { auto* cl = ks.registerStubClass("nenergycollector", "nservice");
      cl->addCmdProto("v_setcollectdistance_f", "SCDN");
      cl->addCmdProto("f_getcollectdistance_v", "GCDN");
    }
    { auto* cl = ks.registerStubClass("ncritter", "ncontainer");
      cl->addCmdProto("b_islanded_v", "CRIL");
      cl->addCmdProto("v_setlanded_b", "CRSL");
    }
    { auto* cl = ks.registerStubClass("ncritterengine", "nservice");
      cl->addCmdProto("v_settargetname_s", "CRST");
      cl->addCmdProto("s_gettargetname_v", "CRGT");
      cl->addCmdProto("v_settargetradius_f", "CRSR");
      cl->addCmdProto("f_gettargetradius_v", "CRGR");
    }
    { auto* cl = ks.registerStubClass("nviewer2", "nroot");
    }
    { auto* cl = ks.registerStubClass("nchaseviewer", "nviewer2");
    }
    { auto* cl = ks.registerStubClass("nfreeviewer", "nviewer2");
      cl->addCmdProto("v_overview_v", "OVER");
    }
    { auto* cl = ks.registerStubClass("nmissileengine3", "nservice");
      cl->addCmdProto("v_setignitiondelay_f", "SIDL");
      cl->addCmdProto("f_getignitiondelay_v", "GIDL");
      cl->addCmdProto("v_setagility_f", "SAGL");
      cl->addCmdProto("f_getagility_v", "GAGL");
      cl->addCmdProto("v_setmaxspeed_f", "SMXS");
      cl->addCmdProto("f_getmaxspeed_v", "GMXS");
      cl->addCmdProto("v_setgravityfactor_f", "SGVF");
      cl->addCmdProto("f_getgravityfactor_v", "GGVF");
    }
    { auto* cl = ks.registerStubClass("nbombard", "nsquadronwatchtarget");
      cl->addCmdProto("v_setmaxaberrance_f", "SABR");
      cl->addCmdProto("f_getmaxaberrance_v", "GABR");
    }
    { auto* cl = ks.registerStubClass("nbomber", "nvehicle");
      cl->addCmdProto("v_setrelpos_fff", "SRPO");
      cl->addCmdProto("fff_getrelpos_v", "GRPO");
    }
    { auto* cl = ks.registerStubClass("nuser", "nroot");
      cl->addCmdProto("v_setactive_b", "STAC");
      cl->addCmdProto("b_isactive_v", "ISAC");
      cl->addCmdProto("v_setwon_b", "STWN");
      cl->addCmdProto("b_haswon_v", "HSWN");
      cl->addCmdProto("v_setloosed_b", "STLO");
      cl->addCmdProto("b_hasloosed_v", "HSLO");
    }
    { auto* cl = ks.registerStubClass("nsession", "nroot");
      cl->addCmdProto("v_makeuser_i", "MKUS");
      cl->addCmdProto("v_setstarted_b", "STST");
      cl->addCmdProto("b_isstarted_v", "ISST");
    }
    { auto* cl = ks.registerStubClass("ncinedummy", "ncontainer");
      cl->addCmdProto("v_settargetsymbolicname_s", "STSN");
    }
    { auto* cl = ks.registerStubClass("nstoresavepos", "nservice");
    }
    { auto* cl = ks.registerStubClass("nmissilecollcheck", "nservice");
      cl->addCmdProto("v_setcollclass_s", "SCCL");
      cl->addCmdProto("s_getcollclass_v", "GCCL");
    }
    { auto* cl = ks.registerStubClass("nrealworld", "nroot");
      cl->addCmdProto("b_opengame_v", "OGAM");
      cl->addCmdProto("b_startgame_v", "SGAM");
      cl->addCmdProto("v_stopgame_v", "XGAM");
      cl->addCmdProto("b_closegame_v", "CGAM");
      cl->addCmdProto("v_pausegame_v", "PGAM");
      cl->addCmdProto("b_ispaused_v", "ISPS");
      cl->addCmdProto("v_contgame_v", "WGAM");
      cl->addCmdProto("v_killgame_v", "KLGM");
      cl->addCmdProto("b_savegame_s", "SVGM");
      cl->addCmdProto("v_announcesavepoint_s", "ANSG");
      cl->addCmdProto("v_announceloadsavepoint_s", "ANLP");
      cl->addCmdProto("b_loadgame_s", "LDGM");
      cl->addCmdProto("b_loadmultiplayergame_s", "LDMG");
      cl->addCmdProto("b_saveencounter_os", "SVEN");
      cl->addCmdProto("o_loadencounter_s", "LDEN");
      cl->addCmdProto("o_loadencounterat_sffffff", "LDEA");
      cl->addCmdProto("b_savecharacter_s", "SVCH");
      cl->addCmdProto("b_loadcharacter_s", "LDCH");
      cl->addCmdProto("b_loadcharacterat_sfff", "LDCA");
      cl->addCmdProto("b_opensession_s", "OPSN");
      cl->addCmdProto("v_closesession_v", "CLSN");
      cl->addCmdProto("v_startsession_v", "STSN");
      cl->addCmdProto("b_issessionstarted_v", "ISSS");
      cl->addCmdProto("b_joinsession_i", "CNCT");
      cl->addCmdProto("b_isnetsession_v", "ISNS");
      cl->addCmdProto("b_isjoined_v", "ISCN");
      cl->addCmdProto("b_ishost_v", "ISHT");
      cl->addCmdProto("o_createclan_v", "CPLR");
      cl->addCmdProto("o_createandselclan_v", "CSCL");
      cl->addCmdProto("o_createclanwithname_s", "CCWN");
      cl->addCmdProto("o_createandselclanwithname_s", "CSCN");
      cl->addCmdProto("v_releaseclan_o", "RPLR");
      cl->addCmdProto("b_setuserclan_o", "SUPL");
      cl->addCmdProto("o_getuserclan_v", "GUPL");
      cl->addCmdProto("o_copyclan_o", "CPCL");
      cl->addCmdProto("v_resetuserclan_v", "RUCL");
      cl->addCmdProto("v_setclanidcount_i", "SCIC");
      cl->addCmdProto("b_sethandcontrol_s", "STHC");
      cl->addCmdProto("v_unsethandcontrol_v", "UTHC");
      cl->addCmdProto("o_gethandcontrol_v", "GTHC");
      cl->addCmdProto("v_refreshdisplay_v", "RFDS");
      cl->addCmdProto("v_settimeofday_f", "STOD");
      cl->addCmdProto("f_gettimeofday_v", "GTOD");
      cl->addCmdProto("v_setdayperiod_f", "SDPD");
      cl->addCmdProto("f_getdayperiod_v", "GDPD");
      cl->addCmdProto("v_setglobaltime_f", "SGLT");
      cl->addCmdProto("o_findvehicle_osfbs", "FNDV");
      cl->addCmdProto("o_findobjectbyclassid_s", "FOID");
      cl->addCmdProto("o_findnextobjectbyclassid_os", "FNID");
      cl->addCmdProto("i_countobjectsbyclassid_s", "COID");
      cl->addCmdProto("v_startrecord_v", "STAR");
      cl->addCmdProto("v_stoprecord_v", "STPR");
      cl->addCmdProto("v_saverecord_s", "SVRC");
      cl->addCmdProto("b_loadrecord_s", "LDRC");
      cl->addCmdProto("b_isrecording_v", "ISRC");
      cl->addCmdProto("b_isplaying_v", "ISPL");
      cl->addCmdProto("b_loadbook2_s", "LBK2");
      cl->addCmdProto("v_restorebook_ss", "RSBK");
      cl->addCmdProto("o_getenvironmentclan_v", "GECL");
      cl->addCmdProto("o_findobjectbysymbolicname_s", "FSYM");
      cl->addCmdProto("o_findnextobjectbysymbolicname_os", "FNSM");
      cl->addCmdProto("o_findclanbysymbolicname_s", "FCSM");
      cl->addCmdProto("o_findnextclanbysymbolicname_os", "FNCS");
      cl->addCmdProto("v_setviewer2_o", "SVW2");
      cl->addCmdProto("o_getviewer2_v", "GVW2");
      cl->addCmdProto("v_setviewercarrier_o", "SVWC");
      cl->addCmdProto("o_getviewercarrier_v", "GVWC");
      cl->addCmdProto("v_resetviewer_v", "RSTV");
      cl->addCmdProto("v_setviewercarriersg_s", "SVCS");
      cl->addCmdProto("v_beginaliases_v", "BALS");
      cl->addCmdProto("v_setalias_ss", "SALS");
      cl->addCmdProto("v_endaliases_v", "EALS");
      cl->addCmdProto("s_getalias_s", "GALS");
      cl->addCmdProto("v_begincookies_v", "BGCK");
      cl->addCmdProto("v_addcookie_ss", "ADCK");
      cl->addCmdProto("v_endcookies_v", "EDCK");
      cl->addCmdProto("v_tclstop_v", "TCLS");
      cl->addCmdProto("v_loadprefs_v", "LDPR");
      cl->addCmdProto("v_saveprefs_v", "SVPR");
      cl->addCmdProto("v_applyprefs_v", "APPR");
      cl->addCmdProto("v_setpref_si", "SEPR");
      cl->addCmdProto("i_getpref_s", "GEPR");
      cl->addCmdProto("v_playsound_s", "PLSN");
      cl->addCmdProto("v_enterwarpmode_v", "EWMO");
      cl->addCmdProto("v_leavewarpmode_v", "LWMO");
      cl->addCmdProto("b_iswarpmode_v", "ISWM");
      cl->addCmdProto("v_setcontrolowner_o", "SCOW");
      cl->addCmdProto("b_iscinematicrunning_v", "ICRN");
      cl->addCmdProto("b_fastpossessactive_v", "FPAC");
      cl->addCmdProto("v_activatefastpossess_v", "ACFP");
      cl->addCmdProto("v_deactivatefastpossess_v", "DAFP");
      cl->addCmdProto("v_setalreadysaved_b", "SALR");
    }
    { auto* cl = ks.registerStubClass("nguibar", "nroot");
      cl->addCmdProto("v_setvisual_s", "STVI");
      cl->addCmdProto("o_getvisual_v", "GTVI");
      cl->addCmdProto("v_setleftvisual_s", "STLV");
      cl->addCmdProto("o_getleftvisual_v", "GTLV");
      cl->addCmdProto("v_setmiddlevisual_s", "STMV");
      cl->addCmdProto("o_getmiddleviusal_v", "GTMV");
      cl->addCmdProto("v_setrightvisual_s", "STRV");
      cl->addCmdProto("o_getrightvisual_v", "GTRV");
      cl->addCmdProto("v_show_v", "SHOW");
      cl->addCmdProto("v_hide_v", "HIDE");
      cl->addCmdProto("b_visible_v", "VSBL");
      cl->addCmdProto("v_setcurrent_f", "STCU");
      cl->addCmdProto("f_getcurrent_v", "GTCU");
      cl->addCmdProto("v_setmax_f", "STMX");
      cl->addCmdProto("f_getmax_v", "GTMX");
      cl->addCmdProto("v_setbasemax_f", "STBM");
      cl->addCmdProto("f_getbasemax_v", "GTBM");
      cl->addCmdProto("v_setextension_f", "STEX");
      cl->addCmdProto("f_getextension_v", "GTEX");
      cl->addCmdProto("v_setoptional_f", "STOP");
      cl->addCmdProto("f_getoptional_v", "GTOP");
      cl->addCmdProto("v_setpos_fff", "STPO");
      cl->addCmdProto("fff_getpos_v", "GTPO");
      cl->addCmdProto("v_setleftpos_fff", "SLPO");
      cl->addCmdProto("fff_getleftpos_v", "GLPO");
      cl->addCmdProto("v_setmiddlepos_fff", "SEPO");
      cl->addCmdProto("fff_getmiddlepos_v", "GEPO");
      cl->addCmdProto("v_setmiddleoffset_fff", "SEOF");
      cl->addCmdProto("fff_getmiddleoffset_v", "GEOF");
      cl->addCmdProto("v_setrightpos_fff", "SRPO");
      cl->addCmdProto("fff_getrightpos_v", "GRPO");
      cl->addCmdProto("v_setscale_fff", "STSC");
      cl->addCmdProto("fff_getscale_v", "GTSC");
      cl->addCmdProto("v_setleftscale_fff", "STLS");
      cl->addCmdProto("fff_getleftscale_v", "GTLS");
      cl->addCmdProto("v_setmiddlescale_fff", "STMS");
      cl->addCmdProto("fff_getmiddlescale_v", "GTMS");
      cl->addCmdProto("v_setrightscale_fff", "STRS");
      cl->addCmdProto("fff_getrightscale_v", "GTRS");
    }
    { auto* cl = ks.registerStubClass("ncritterdamage", "nservice");
      cl->addCmdProto("v_setdamagerange_f", "SDRA");
      cl->addCmdProto("f_getdamagerange_v", "GDRA");
    }
    { auto* cl = ks.registerStubClass("ncharaudio", "naudio");
      cl->addCmdProto("v_setdelay_f", "SDEL");
      cl->addCmdProto("v_setfirstdelay_f", "SFDE");
      cl->addCmdProto("f_getdelay_v", "GDEL");
      cl->addCmdProto("f_getfirstdelay_v", "GFDE");
      cl->addCmdProto("v_setbackdelay_f", "SDEB");
      cl->addCmdProto("v_setfirstbackdelay_f", "SFDB");
      cl->addCmdProto("f_getbackdelay_v", "GDEB");
      cl->addCmdProto("f_getfirstbackdelay_v", "GFDB");
      cl->addCmdProto("v_setturnstep_b", "STUR");
    }
    { auto* cl = ks.registerStubClass("ndebris", "ncontainer");
    }
}
